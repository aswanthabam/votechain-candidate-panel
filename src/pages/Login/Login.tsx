import { generateRandomKey } from "../../utils/utils";
import { useEffect, useState } from "react";
import { useSystemSettings } from "../../hooks/useSystemSettings";
import { decrypt } from "../../utils/encryption";
import { useNavigate } from "react-router-dom";
import { LoginPage1 } from "./LoginPage1";
import { LoginPage2 } from "./LoginPage2";
import { VoterInfo } from "../../utils/types";
import { LoginPage3 } from "./LoginPage3";
// import { useKey } from "../../hooks/useKey";

export const Login = () => {
  const [code, setCode] = useState<string | null>(null);
  const { systemSettings } = useSystemSettings();
  const [codeScanned, setCodeScanned] = useState(false);
  const [step, setStep] = useState(0);
  const [voterInfo, setVoterInfo] = useState<VoterInfo | null>(null);
  const redirect = useNavigate();

  const submitUserQRData = (data: VoterInfo) => {
    console.log(data);
    setVoterInfo(data);
    setStep(1);
  };

  useEffect(() => {
    var k1 = generateRandomKey(10, 15);
    var k2 = generateRandomKey(400, 500);
    var perms = "function";
    var code = `${k1}|${k2}|${perms}|candidate.register`;
    var connection_count = 0;
    setCode(code);
    var socket = new WebSocket(
      (systemSettings
        ? systemSettings.websocketServer
        : "ws://localhost:8080") + `/ws/user/access/`
    );
    socket.onopen = () => {
      console.log("WebSocket connection opened");
      socket.send(JSON.stringify({ token: k1, type: "connect" }));
    };

    socket.onmessage = (event) => {
      console.log("Received message:", event.type);
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

        if (data.type === "send") {
          var received = JSON.parse(decrypt(data.data.value, k2));
          console.log(received);
          submitUserQRData(received);
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
  const getPage = () => {
    switch (step) {
      case 0:
        return <LoginPage1 code={code} codeScanned={codeScanned}></LoginPage1>;
      case 1:
        return (
          <LoginPage2
            onConfirm={() => {
              setStep(2);
            }}
            info={voterInfo!}
          ></LoginPage2>
        );
      case 2:
        return (
          <LoginPage3
            onSubmit={() => {
              // redirect("/");
            }}
            info={voterInfo!}
          ></LoginPage3>
        );
      default:
        return <LoginPage1 code={code} codeScanned={codeScanned}></LoginPage1>;
    }
  };
  return getPage();
};
