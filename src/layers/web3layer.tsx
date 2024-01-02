import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useWeb3 } from "../hooks/useWeb3";
import { useSystemSettings } from "../hooks/useSystemSettings";
import { getSystemConfig } from "../services/api_services/system_config";
import { useContracts } from "../hooks/useContracts";
import voterAbi from "../assets/contracts/Voter.abi.json";
import voterReaderAbi from "../assets/contracts/VoterReader.abi.json";
import candidateAbi from "../assets/contracts/Candidate.abi.json";
import votechainAbi from "../assets/contracts/VoteChain.abi.json";
import permissionsAbi from "../assets/contracts/Permissions.abi.json";
import linkerAbi from "../assets/contracts/Linker.abi.json";
import { useDialog } from "../hooks/useDialog";
import { useNavigate } from "react-router-dom";
// import { useKey } from "../hooks/useKey";

interface Web3ProviderProps {
  children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  // const { web3, setWeb3 } = useWeb3();
  const { setSystemSettings } = useSystemSettings();
  // const { contracts, setContracts } = useContracts();
  const { setDialog, showDialog } = useDialog();
  const [loaded, setLoaded] = useState(false);
  // const redirect = useNavigate();
  // const { key } = useKey();
  useEffect(() => {
    getSystemConfig()
      .then((res) => {
        if (res) {
          setSystemSettings(res);
          console.log("System settings loaded ....");
          setLoaded(true);
        } else {
          setDialog(
            <h1>
              Error occured while loading system settings, Please try to refresh
              !
            </h1>
          );
          showDialog();
        }
      })
      .catch((err) => {
        console.log(err);
        setDialog(
          <h1>
            Error occured while loading system settings, Please try to refresh !
          </h1>
        );
        showDialog();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loaded ? (
        children
      ) : (
        <h1 className="text-2xl">Initializing client, Please wait ...</h1>
      )}
    </>
  );
};
