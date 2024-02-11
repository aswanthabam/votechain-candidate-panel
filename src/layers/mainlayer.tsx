import React, { ReactNode, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/sidebar/SideBar";
import { Web3Provider } from "./web3layer";
import { DialogLayer } from "./dialoglayer";
import { useSystemSettings } from "../hooks/useSystemSettings";
import axios from "axios";
// import { KeyProvider } from "./keyprovider";
interface MainLayerProps {
  children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
}
const MainLayer: React.FC<MainLayerProps> = ({ children }) => {
  const { setSystemSettings } = useSystemSettings();
  useEffect(() => {
    console.log("MainLayer mounted");
    axios
      .get("https://votechain-backend.vercel.app/api/system/config")
      .then((res) => {
        console.log("System settings", res.data.data[0]);
        setSystemSettings(res.data.data[0]);
      });
    return () => {
      console.log("MainLayer unmounted");
    };
  }, []);
  return (
    <div className="flex h-full w-screen p-0 m-0 overflow-hidden">
      <SideBar />
      <div className="flex-none w-11/12 h-screen bg-base-100 overflow-auto p-4">
        <DialogLayer>
          <Web3Provider>
            {/* <KeyProvider> */}
            {/* <Outlet /> */}
            {children}
            {/* </KeyProvider> */}
          </Web3Provider>
        </DialogLayer>
      </div>
    </div>
  );
};

export default MainLayer;
