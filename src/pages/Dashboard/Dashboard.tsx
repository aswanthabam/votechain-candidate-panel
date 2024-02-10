import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { generateRandomKey } from "../../utils/utils";
import { useSystemSettings } from "../../hooks/useSystemSettings";
import { decrypt } from "../../utils/encryption";
import axios from "axios";
interface DashboardProps {}
export const Dashboard: React.FC<DashboardProps> = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [k1, setK1] = useState<string | null>(null);
  const [, setK2] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const { systemSettings } = useSystemSettings();
  const [codeScanned, setCodeScanned] = useState(false);
  const [accessKey, setAccessKey] = useState<string | null>(null);

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
    getCandidateProfile();
  }, [accessKey]);

  function getCandidateProfile() {
    if (accessKey) {
      var url =
        systemSettings?.localServer +
        `/api/candidate/profile/?ACCESS_KEY=${accessKey}`;
      console.log(url);
      axios.get(url).then((res) => {
        console.log(res);
      });
    }
  }
  return accessKey ? (
    <div className="flex items-center h-full pt-20 justify-center gap-20">
      <a href="/dashboard/edit-profile" className="btn btn-primary">
        Edit Profile
      </a>
    </div>
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
