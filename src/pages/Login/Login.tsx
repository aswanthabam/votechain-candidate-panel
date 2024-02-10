import { generateRandomKey } from "../../utils/utils";
import React, { useEffect, useState } from "react";
import { useSystemSettings } from "../../hooks/useSystemSettings";
import { decrypt } from "../../utils/encryption";
import { LoginPage1 } from "./LoginPage1";
import { LoginPage2 } from "./LoginPage2";
import {
  Constituency,
  District,
  Election,
  State,
  VoterInfo,
  electionFromList,
} from "../../utils/types";
import { LoginPage3 } from "./LoginPage4";
import { getStates } from "../../services/api_services/location";
import { useContracts } from "../../hooks/useContracts";
import { SuccessLogin } from "./SuccessLogin";
import { FailLogin } from "./FailLogin";
import axios from "axios";

export const Login = () => {
  const [code, setCode] = useState<string | null>(null);
  const { systemSettings } = useSystemSettings();
  const [codeScanned, setCodeScanned] = useState(false);
  const [step, setStep] = useState(0);
  const [voterInfo, setVoterInfo] = useState<VoterInfo | null>(null);
  const [states, setStates] = React.useState<State[]>([]);
  const [districts, setDistricts] = React.useState<District[]>([]);
  const [constituencies, setConstituencies] = React.useState<Constituency[]>(
    []
  );
  const [constituency, setConstituency] = React.useState<Constituency | null>(
    null
  );
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [k1, setK1] = useState<string | null>(null);
  const [, setK2] = useState<string | null>(null);
  const { contracts } = useContracts();
  const [election, setElection] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );

  useEffect(() => {
    getStates().then((res) => {
      setStates(res ? res : []);
    });
  }, []);

  const onSubmit = () => {
    console.log("Submitting data");
    console.log("SElected Election", selectedElection);
    var data = {
      election: selectedElection,
    };
    var _data = JSON.stringify({
      token: k1,
      type: "send_back",
      data: data,
    });
    console.log(`Sending data: ${data}`);
    socket?.send(_data);
  };

  const onConstitutionSelect = async (constituency: Constituency) => {
    var out: any[] = await (
      contracts.votechain?.methods.getNominatableElections as any
    )(constituency.id).call();
    var elections = out.map((val) => {
      return electionFromList(val);
    });

    if (elections.length === 0) {
      alert("No elections found for this constituency.");
      setElection([]);
      return;
    }
    var elc = elections as Election[];
    console.log("Nominatable elections: ", elc);
    setElection(elc);
    // setStep(2);
  };

  const submitUserQRData = (data: VoterInfo) => {
    console.log(data);
    setVoterInfo(data);
    setStep(1);
  };

  useEffect(() => {
    var k1 = generateRandomKey(10, 15);
    var k2 = generateRandomKey(400, 500);
    setK1(k1);
    setK2(k2);
    var clientId = "myconstantclientIDforcandidatepanel";
    var perms = "function";
    var code = `${k1}|${k2}|${perms}|candidate.register.stay.${clientId}.candidate_profile`;
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
            setStep(10);
            console.log("Access key received: ", data.data.value);
            localStorage.setItem("access_key", data.data.value);
            axios
              .post(
                systemSettings?.localServer +
                  "/api/candidate/register/?ACCESS_KEY=" +
                  data.data.value
              )
              .then((res) => {
                console.log(res);
              });
          } else {
            setStep(11);
            alert("Error occured while registering, please try again.");
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
            onSubmit={(e: Election) => {
              setSelectedElection(e);
              setStep(2);
            }}
            onChange={onConstitutionSelect}
            info={voterInfo!}
            states={states}
            districts={districts}
            constituencies={constituencies}
            setDistricts={setDistricts}
            setConstituencies={setConstituencies}
            setConstituency={setConstituency}
            // constituency={constituency}
            election={election}
          ></LoginPage2>
        );
      case 2:
        return (
          <LoginPage3
            onConfirm={() => {
              // redirect("/");
              onSubmit();
            }}
            info={voterInfo!}
            constituency={constituency!}
          ></LoginPage3>
        );
      case 10:
        return <SuccessLogin> </SuccessLogin>;
      case 11:
        return <FailLogin></FailLogin>;
      default:
        return <LoginPage1 code={code} codeScanned={codeScanned}></LoginPage1>;
    }
  };
  return getPage();
};
