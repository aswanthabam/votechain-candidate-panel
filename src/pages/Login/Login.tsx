import QRCode from "react-qr-code";
import { generateRandomKey } from "../../utils/utils";
import { useEffect, useState } from "react";
import { useSystemSettings } from "../../hooks/useSystemSettings";
import { decrypt } from "../../utils/encryption";
import { useNavigate } from "react-router-dom";
// import { useKey } from "../../hooks/useKey";

export const Login = () => {
  const [code, setCode] = useState<string | null>(null);
  const { systemSettings } = useSystemSettings();
  const [codeScanned, setCodeScanned] = useState(false);
  const redirect = useNavigate();

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
          // submitPrivatekey("0x" + received.private_key);
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
  return (
    <div className="flex items-center h-full pt-20 justify-center gap-20">
      <div className="flex h-full items-center flex-col justify-center text-center w-auto">
        <h1 className="text-5xl font-bold mb-10 text-center">
          Submit Nomination
        </h1>
        <p className="w-80">
          For submitting your nomination, you need to scan the QR code with your
          votechain app to continue. make sure the votechain app is open until
          you complete the registration with a good netword connection.
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
