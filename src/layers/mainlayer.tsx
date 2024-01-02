import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/sidebar/SideBar";
import { Web3Provider } from "./web3layer";
import { DialogLayer } from "./dialoglayer";
// import { KeyProvider } from "./keyprovider";

const MainLayer: React.FC = () => {
  return (
    <div className="flex h-full w-screen p-0 m-0 overflow-hidden">
      <SideBar />
      <div className="flex-none w-11/12 h-screen bg-base-100 overflow-auto p-4">
        <DialogLayer>
          <Web3Provider>
            {/* <KeyProvider> */}
            <Outlet />
            {/* </KeyProvider> */}
          </Web3Provider>
        </DialogLayer>
      </div>
    </div>
  );
};

export default MainLayer;
