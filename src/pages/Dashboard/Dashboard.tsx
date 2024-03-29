import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { generateRandomKey } from "../../utils/utils";
import { useSystemSettings } from "../../hooks/useSystemSettings";
import { getCandidateProfile } from "../../services/api_services/candidate";
import {
  CandidateProfile,
  Constituency,
  Election,
  electionFromList,
} from "../../utils/types";
import { useDialog } from "../../hooks/useDialog";
import {
  AddEducation,
  AddExperience,
  EditAbout,
  EditContact,
  UploadDocument,
  UploadProfilePicture,
} from "./EditProfile";
import { useContracts } from "../../hooks/useContracts";
import { getConstituencies } from "../../services/api_services/location";
import { Link } from "react-router-dom";
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
  const { setDialog, showDialog, setButtons, hideDialog } = useDialog();
  const [reload, setReload] = useState(false);
  const [nominatedElections, setNominatedElections] = useState<
    (Election & { constituencyData: Constituency })[]
  >([]);
  const [nominatedElectionsLoaded, setNominatedElectionsLoaded] =
    useState(false);
  const [candidateElections, setCandidateElections] = useState<
    (Election & { constituencyData: Constituency })[]
  >([]);
  const [candidateElectionsLoaded, setCandidateElectionsLoaded] =
    useState<boolean>(false);

  const { contracts } = useContracts();
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
  }, [accessKey, reload]);
  useEffect(() => {
    (window as any).contracts = contracts;
    contracts?.votechain?.methods.getMyNominations &&
      (contracts?.votechain?.methods.getMyNominations as any)(5)
        .call({ from: candidateProfile?.candidateAddress ?? "" })
        .then(async (res: number[]) => {
          var elections: (Election & { constituencyData: Constituency })[] = [];
          for (var electionId of res) {
            await (contracts?.votechain?.methods.elections as any)(electionId)
              .call()
              .then(async (electionData: any) => {
                var election = electionFromList(electionData);
                var r: Constituency[] = (await getConstituencies(
                  null,
                  null,
                  election?.constituency.toString()
                ))!;
                if (election) {
                  (
                    election as Election & {
                      constituencyData: Constituency;
                    }
                  ).constituencyData = r[0];

                  elections.push(
                    election as Election & { constituencyData: Constituency }
                  );
                }
              });
          }
          setNominatedElections(elections);
          setNominatedElectionsLoaded(true);
        });
    contracts?.votechain?.methods.getMyElections &&
      (contracts?.votechain?.methods.getMyElections as any)()
        .call({ from: candidateProfile?.candidateAddress ?? "" })
        .then(async (res: number[]) => {
          var elections: (Election & { constituencyData: Constituency })[] = [];
          for (var electionId of res) {
            await (contracts?.votechain?.methods.elections as any)(electionId)
              .call()
              .then(async (electionData: any) => {
                var election = electionFromList(electionData);
                var r: Constituency[] = (await getConstituencies(
                  null,
                  null,
                  election?.constituency.toString()
                ))!;
                if (election) {
                  (
                    election as Election & {
                      constituencyData: Constituency;
                    }
                  ).constituencyData = r[0];

                  elections.push(
                    election as Election & { constituencyData: Constituency }
                  );
                }
              });
          }
          setCandidateElections(elections);
          setCandidateElectionsLoaded(true);
        });
  }, [candidateProfile, contracts]);

  return accessKey ? (
    candidateProfile ? (
      <div className="flex flex-col pt-20 justify-center gap-10 items-start">
        <div className="flex justify-start gap-16 items-center">
          <div className=" relative">
            <img
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
              src={
                candidateProfile.photo
                  ? systemSettings?.localServer + candidateProfile.photo
                  : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
              }
              alt="profile"
              className="w-40 h-40 rounded-full"
            />
            <i
              onClick={() => {
                setDialog(
                  <UploadProfilePicture
                    hideDialog={() => {
                      setReload(!reload);
                      hideDialog();
                    }}
                  />
                );
                setButtons([]);
                showDialog();
              }}
              className=" absolute bi bi-pencil bottom-2 right-2 bg-emerald-600 shadow shadow-black z-50 flex items-center justify-center btn-circle w-10 h-10  p-3"
            ></i>
          </div>
          <div className="flex flex-col items-start gap-10">
            <h2 className="text-5xl font-bold text-center">
              Welcome <i>{candidateProfile.name},</i>
            </h2>
            <span className="text-xl">
              Here you can edit your candidate profile, like about section,
              profile photo, education, experience etc
            </span>
          </div>
        </div>
        <h2 className="text-3xl font-bold m-0 underline underline-offset-8">
          Your Nominations
        </h2>
        <div className="flex flex-col items-start justify-start gap-5 w-full bg-slate-200 p-5 rounded-xl m-0">
          {nominatedElectionsLoaded && candidateElectionsLoaded ? (
            nominatedElections.length < 1 && candidateElections.length < 1 ? (
              "You have not nominated for any election yet"
            ) : (
              <table className="table w-full table-zebra">
                <thead>
                  <tr className=" bg-slate-400">
                    <th>Election Name</th>
                    <th>Constituency</th>
                    <th>Nomination status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Withdraw</th>
                  </tr>
                </thead>
                <tbody>
                  {nominatedElections.map((election) => {
                    return (
                      election && (
                        <tr>
                          <td>{election.name ?? ""}</td>
                          <td>{election.constituencyData.name ?? ""}</td>
                          <td>Unverified</td>
                          <td>
                            {new Date(election.start_date).toDateString()}
                          </td>
                          <td>{new Date(election.end_date).toDateString()}</td>
                          <td>
                            <Link
                              to={
                                "/dashboard/withdraw-nomination/" + election.id
                              }
                            >
                              <button className="btn btn-danger pt-0 pb-0 pl-2 pr-2 text-xs">
                                Withdraw Nomination
                              </button>
                            </Link>
                          </td>
                        </tr>
                      )
                    );
                  })}
                  {candidateElections.map((election) => {
                    return (
                      election && (
                        <tr>
                          <td>{election.name ?? ""}</td>
                          <td>{election.constituencyData.name ?? ""}</td>
                          <td>Verified</td>
                          <td>
                            {new Date(election.start_date).toDateString()}
                          </td>
                          <td>{new Date(election.end_date).toDateString()}</td>
                          <td>
                            <button className="btn btn-danger pt-0 pb-0 pl-2 pr-2 text-xs"></button>
                          </td>
                        </tr>
                      )
                    );
                  })}
                </tbody>
              </table>
            )
          ) : (
            <div className="w-full flex justify-center items-center">
              <span className="loading loading-lg"></span>&nbsp; &nbsp; Loading
              ..
            </div>
          )}
        </div>
        <h2 className="text-3xl font-bold m-0 underline underline-offset-8">
          Your Profile
        </h2>
        <div className="flex flex-col items-start justify-start gap-5 w-full bg-slate-200 p-10 rounded-xl m-0">
          <div className="flex justify-between w-full">
            <h4 className="text-2xl font-bold underline underline-offset-8">
              Contact Details
            </h4>
            <button
              onClick={() => {
                setDialog(
                  <EditContact
                    hideDialog={() => {
                      setReload(!reload);
                      hideDialog();
                    }}
                  />
                );
                setButtons([]);
                showDialog();
              }}
              className="btn btn-neutral pt-0 pb-0 pl-3 pr-3"
            >
              <i className="bi bi-pencil"></i> Edit Contact Details
            </button>
          </div>
          <div className="flex gap-5 w-full flex-col">
            <table className="table table-zebra">
              <tbody>
                <tr>
                  <th>Phone</th>
                  <td>{candidateProfile.phone ?? "No phone number added"}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{candidateProfile.email ?? "No email address added"}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>{candidateProfile.address ?? "No address added"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h1 className="font-bold underline underline-offset-8 text-2xl mb-5">
            Party Details
          </h1>
          <div className="overflow-x-auto w-full gap-5 flex-col flex h-full mb-5">
            <div className="flex items-center w-full gap-10">
              <img
                src={systemSettings?.localServer + candidateProfile.logo!}
                style={{
                  width: 100,
                  height: 100,
                  margin: 0,
                  padding: 0,
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              <table
                style={{ width: "calc(100% - 150px)" }}
                className="table table-zebra"
              >
                <tbody>
                  <tr>
                    <th>ID</th>
                    <td>{candidateProfile.party.partyId ?? "Indepentent"}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{candidateProfile.party.name ?? "Indepentent"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-between w-full">
            <h4 className="text-2xl font-bold underline underline-offset-8">
              About Candidate
            </h4>
            <button
              onClick={() => {
                setDialog(
                  <EditAbout
                    hideDialog={() => {
                      setReload(!reload);
                      hideDialog();
                    }}
                  />
                );
                setButtons([]);
                showDialog();
              }}
              className="btn btn-neutral pt-0 pb-0 pl-3 pr-3"
            >
              <i className="bi bi-pencil"></i> Edit About
            </button>
          </div>
          <p>
            {candidateProfile.about
              ? candidateProfile.about
              : " * You are not yet added your about section, click on the edit about button above to add an about section"}
          </p>
          <div className="flex justify-between w-full">
            <h4 className="text-2xl font-bold underline underline-offset-8">
              Your Education
            </h4>
            <button
              onClick={() => {
                setDialog(
                  <AddEducation
                    hideDialog={() => {
                      setReload(!reload);
                      hideDialog();
                    }}
                  />
                );
                setButtons([]);
                showDialog();
              }}
              className="btn btn-neutral pt-0 pb-0 pl-3 pr-3"
            >
              <i className="bi bi-plus-lg"></i> Add Education
            </button>
          </div>
          {candidateProfile.education.length > 0 ? (
            <table className="table w-full table-zebra">
              <thead>
                <tr className=" bg-slate-200">
                  <th>Title</th>
                  <th>From Where</th>
                  <th>Description</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {candidateProfile.education.map((edu) => (
                  <tr>
                    <td>{edu.title}</td>
                    <td>{edu.fromWhere}</td>
                    <td>{edu.description}</td>
                    <td className="w-auto">
                      <i onClick={() => {}} className="bi bi-trash3"></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            " * You are not yet added your education, click on the add education button above to add an education"
          )}
          <div className="flex justify-between w-full">
            <h4 className="text-2xl font-bold underline underline-offset-8">
              Your Experience
            </h4>
            <button
              onClick={() => {
                setDialog(
                  <AddExperience
                    hideDialog={() => {
                      setReload(!reload);
                      hideDialog();
                    }}
                  />
                );
                setButtons([]);
                showDialog();
              }}
              className="btn btn-neutral pt-0 pb-0 pl-3 pr-3"
            >
              <i className="bi bi-plus-lg"></i> Add Experience
            </button>
          </div>
          {candidateProfile.experience.length > 0 ? (
            <table className="table w-full table-zebra">
              <thead>
                <tr className=" bg-slate-200">
                  <th>Title</th>
                  <th>From Where</th>
                  <th>Description</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {candidateProfile.experience.map((edu) => (
                  <tr>
                    <td>{edu.title}</td>
                    <td>{edu.fromWhere}</td>
                    <td>{edu.description}</td>
                    <td className="w-auto">
                      <i onClick={() => {}} className="bi bi-trash3"></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            " * You are not yet added your education, click on the add education button above to add an education"
          )}
          <div className="flex justify-between w-full">
            <h4 className="text-2xl font-bold underline underline-offset-8">
              Documents Uploaded
            </h4>
            <button
              onClick={() => {
                setDialog(
                  <UploadDocument
                    hideDialog={() => {
                      setReload(!reload);
                      hideDialog();
                    }}
                  />
                );
                setButtons([]);
                showDialog();
              }}
              className="btn btn-neutral pt-0 pb-0 pl-3 pr-3"
            >
              <i className="bi bi-plus-lg"></i> Upload Document
            </button>
          </div>
          {candidateProfile.documents.length > 0 ? (
            <table className="table w-full table-zebra">
              <thead>
                <tr className=" bg-slate-200">
                  <th>Title</th>
                  <th>Link</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {candidateProfile.documents.map((edu) => (
                  <tr>
                    <td>{edu.title}</td>
                    <td>
                      <a href={systemSettings?.localServer + edu.link}>
                        {systemSettings?.localServer + edu.link}
                      </a>
                    </td>
                    <td className="w-auto">
                      <i onClick={() => {}} className="bi bi-trash3"></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            " * You are not yet added your education, click on the add education button above to add an education"
          )}
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
