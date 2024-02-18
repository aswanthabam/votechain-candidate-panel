import { generateRandomKey } from "../../utils/utils";
import React, { useEffect, useState } from "react";
import { useSystemSettings } from "../../hooks/useSystemSettings";
import { Election, electionFromList } from "../../utils/types";
import QRCode from "react-qr-code";
import { useNavigate, useParams } from "react-router-dom";
import { useContracts } from "../../hooks/useContracts";

interface WithdrawNominationProps {}

export const WithdrawNomination: React.FC<WithdrawNominationProps> = ({}) => {
  const [code, setCode] = useState<string | null>(null);
  const { systemSettings } = useSystemSettings();
  const [codeScanned, setCodeScanned] = useState(false);
  const [, setSocket] = useState<WebSocket | null>(null);
  const [, setK1] = useState<string | null>(null);
  const [, setK2] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const [election, setElection] = useState<Election | null>(null);
  const { contracts } = useContracts();
  const redirect = useNavigate();
  useEffect(
    () => {
      contracts.votechain?.methods.elections &&
        (contracts.votechain?.methods.elections as any)(id)
          .call()
          .then((res: any) => {
            setElection(electionFromList(res));
          });
    },
    //eslint-disable-next-line
    [contracts]
  );
  useEffect(() => {
    if (election === null) return;
    var k1 = generateRandomKey(10, 15);
    var k2 = generateRandomKey(400, 500);
    setK1(k1);
    setK2(k2);
    // var clientId = "myconstantclientIDforcandidatepanel";

    var perms = "function";
    var code = `${k1}|${k2}|${perms}|candidate.withdraw.stay.${election.id}`;
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
        console.log("Received data: ", data);
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
            alert(
              "Your nomination on election has been withdrawn successfully."
            );
            redirect("/dashboard");
          } else {
            alert(
              "Error occured while withdrawing nomination, please try again."
            );
            redirect("/dashboard");
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
  }, [election]);

  return election ? (
    <div className="flex items-center h-full pt-20 justify-center gap-20">
      <div className="flex h-full items-center flex-col justify-center text-center w-auto">
        <h1 className="text-5xl font-bold mb-10 text-center">
          Withdraw Nomination for Election {election?.name}
        </h1>
        <p className="w-80">
          For withdrawing your nomination, you need to scan the QR code with
          your votechain app to continue. make sure the votechain app is open
          until the opertaion is complete.
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
  ) : (
    <div className="flex justify-center items-center h-full w-full">
      <span className="loading loading-lg"></span>
    </div>
  );
};
