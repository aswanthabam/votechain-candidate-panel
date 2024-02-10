import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { generateRandomKey } from "../../utils/utils";
import { useSystemSettings } from "../../hooks/useSystemSettings";
import { getCandidateProfile } from "../../services/api_services/candidate";
import { CandidateProfile } from "../../utils/types";
interface DashboardProps {}
export const Dashboard: React.FC<DashboardProps> = () => {
  const [, setSocket] = useState<WebSocket | null>(null);
  const [, setK1] = useState<string | null>(null);
  const [, setK2] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const { systemSettings } = useSystemSettings();
  const [codeScanned, setCodeScanned] = useState(false);
  const [accessKey, setAccessKey] = useState<string | null>(null);
  const [candidateProfile, setCanidateProfile] =
    useState<CandidateProfile | null>(null);
  useEffect(() => {
    var access_key = localStorage.getItem("access_key");
    if (access_key !== null) {
      setAccessKey(access_key);
      return;
    }
    var k1 = generateRandomKey(10, 15);
    var k2 = generateRandomKey(400, 500);
    setK1(k1);
    setK2(k2);
    var clientId = "myconstantclientIDforcandidatepanel";
    var code = `${k1}|${k2}|function|candidate.dashboard.stay.${clientId}.candidate_profile`;
    var connection_count = 0;
    setCode(code);
    var socket = new WebSocket(
      (systemSettings
        ? systemSettings.websocketServer
        : "ws://localhost:8080") + `/ws/user/access/`
    );
    setSocket(socket);
    socket.onopen = () => {
      console.log("WebSocket connection opened");
      socket.send(JSON.stringify({ token: k1, type: "connect" }));
    };

    socket.onmessage = (event) => {
      console.log("Received message:", event);
      try {
        var data = JSON.parse(event.data);
        if (data.type === "connect_response") {
          if (data.status === "success") {
            console.log("Connected room.");
            connection_count++;
            if (connection_count > 1) {
              setCodeScanned(true);
            }
            return;
          }
        }

        if (data.type == "result") {
          if (data.data.status == "success") {
            localStorage.setItem("access_key", data.data.value);
            socket.close();
            setAccessKey(data.data.value);
          } else {
            alert("Error occured while registering, please try again.");
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    console.log(socket);
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    getCandidateProfile(systemSettings!.localServer).then((res) => {
      console.log(res);
      setCanidateProfile(res);
    });
  }, [accessKey]);

  return accessKey ? (
    candidateProfile ? (
      <div className="flex flex-col pt-20 justify-center gap-20 items-start">
        <div className="flex justify-start gap-16 items-center">
          <img
            style={{ width: "100px", height: "100px" }}
            src={
              candidateProfile.photo ??
              "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
            }
            alt="profile"
            className="w-40 h-40 rounded-full"
          />
          <h2 className="text-5xl font-bold text-center">
            Welcome <i>{candidateProfile.name},</i>
          </h2>
        </div>
        <div className="flex justify-start gap-16 items-center">
          <a href="/dashboard/edit-profile" className="btn btn-primary">
            Edit Profile
          </a>
        </div>
        <div className="flex flex-col items-start justify-start gap-5 w-full">
          <h3 className="text-2xl font-bold underline underline-offset-8">
            {candidateProfile.name}
          </h3>
          <h4>About Candidate</h4>
          <p>{candidateProfile.about}</p>
          <h4 className="font-bold">Education</h4>
          <table className="table w-full table-zebra">
            <thead>
              <tr className=" bg-slate-200">
                <th>Title</th>
                <th>From Where</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {candidateProfile.education.map((edu) => (
                <tr>
                  <td>{edu.title}</td>
                  <td>{edu.fromWhere}</td>
                  <td>{edu.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className="font-bold">Experience</h4>
          <table className="table w-full table-zebra">
            <thead>
              <tr className=" bg-slate-200">
                <th>Title</th>
                <th>From Where</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {candidateProfile.experience.map((edu) => (
                <tr>
                  <td>{edu.title}</td>
                  <td>{edu.fromWhere}</td>
                  <td>{edu.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className="font-bold">Documents</h4>
          <table className="table w-full table-zebra">
            <thead>
              <tr className=" bg-slate-200">
                <th>Title</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {candidateProfile.documents.map((edu) => (
                <tr>
                  <td>{edu.title}</td>
                  <td>
                    <a href={systemSettings?.localServer + edu.link}>
                      {edu.link}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        "
      </div>
    ) : (
      <h1>Loading ...</h1>
    )
  ) : (
    <div className="flex items-center h-full pt-20 justify-center gap-20">
      <div className="flex h-full items-center flex-col justify-center text-center w-auto">
        <h1 className="text-5xl font-bold mb-10 text-center">
          Login with Votechain
        </h1>
        <p className="w-80">
          For logging in to the candidate dashboard you need to scan the QR code
          using Votechain app.
        </p>
      </div>
      <div className="flex justify-center items-center flex-col">
        <>
          <p className="text-center">
            Scan the below QR Code with the votechain app
          </p>
          <div className="flex justify-center items-center w-auto m-auto mt-10 p-10 bg-white rounded-2xl">
            {code &&
              (codeScanned ? (
                <span className="loading loading-infinity loading-lg"></span>
              ) : (
                <QRCode value={code} />
              ))}
          </div>
        </>
      </div>
    </div>
  );
};
