import QRCode from "react-qr-code";
import { generateRandomKey } from "../../utils/utils";
import { useEffect, useState } from "react";
import { useSystemSettings } from "../../hooks/useSystemSettings";
import { decrypt } from "../../utils/encryption";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../../hooks/useWeb3";
import { useContracts } from "../../hooks/useContracts";
import { useDialog } from "../../hooks/useDialog";
// import { useKey } from "../../hooks/useKey";

export const AddAdmin = () => {
  const [code, setCode] = useState<string | null>(null);
  const { systemSettings } = useSystemSettings();
  const [codeScanned, setCodeScanned] = useState(false);
  const { contracts } = useContracts();
  const { setDialog, showDialog } = useDialog();
  const [privateKeyInput, setPrivateKeyInput] = useState<string | null>();
  const redirect = useNavigate();
  const { web3 } = useWeb3();
  const submitPrivatekey = (key: string, name: string) => {
    (contracts.permissions?.methods.addAdmin as any)(name, key, 1)
      .send({
        from: web3.eth.accounts.wallet[0].address,
      })
      .then((val: any) => {
        console.log(val);
      })
      .catch((err: any) => {
        console.log(err);
        setDialog(<h1>There was an error assigning admin</h1>);
        showDialog();
      });
  };
  useEffect(() => {
    console.log(web3.eth.accounts.wallet[0].address);
    var k1 = generateRandomKey(10, 15);
    var k2 = generateRandomKey(400, 500);
    var perms = "all";
    var code = `${k1}|${k2}|${perms}`;
    var connection_count = 0;
    (window as any).contracts = contracts;
    console.log("Default account : ", web3.eth.defaultAccount);
    contracts.permissions?.methods
      .getMyRole()
      .call({
        from: web3.eth.accounts.wallet[0].address,
      })
      .then((val) => {
        console.log("Current role: ", val);
      });
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
          submitPrivatekey(
            received.address,
            `${received.personal_info.first_name} ${received.personal_info.middle_name} ${received.personal_info.last_name}`
          );
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
        <h1 className="text-5xl font-bold mb-10 text-center">Add an admin</h1>
        <p className="w-80">
          For adding an admin you want to scan the QR code with your approved
          votechain app, or you want to enter your given private key here
        </p>
      </div>
      <div className="flex justify-center items-center flex-col">
        <p className="">Scan the below QR Code with the votechain app</p>
        <div className="flex justify-center items-center w-auto m-auto mt-10 p-10 bg-white rounded-2xl">
          {code &&
            (codeScanned ? (
              <span className="loading loading-infinity loading-lg"></span>
            ) : (
              <QRCode value={code} />
            ))}
        </div>
        <p className="mt-5 mb-5">Or enter your private key below</p>
        <input
          type="text"
          placeholder="Private Key"
          value={privateKeyInput ?? ""}
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => {
            setPrivateKeyInput(e.target.value);
          }}
        />
      </div>
    </div>
  );
};
