import { ReactNode, createContext, useContext, useState } from "react";
import Web3 from "web3";

interface Web3State {
  web3: Web3;
  setStatus: React.Dispatch<React.SetStateAction<{ web3: Web3 }>>;
}

const Web3StateContext = createContext<Web3State | undefined>(undefined);

interface Web3StateProviderProps {
  children: ReactNode;
}

export const Web3StateProvider: React.FC<Web3StateProviderProps> = ({
  children,
}) => {
  const [status, setStatus] = useState({
    web3: new Web3("http://localhost:8545"),
  });
  const Web3State: Web3State = {
    web3: status.web3,
    setStatus: setStatus,
  };

  return (
    <Web3StateContext.Provider value={Web3State}>
      {children}
    </Web3StateContext.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3StateContext);
  if (!context) {
    throw new Error("useWeb3State must be used within a SharedStateProvider");
  }
  function setWeb3(w: Web3) {
    context!.web3 = w;
    context!.setStatus({ web3: context!.web3 });
  }
  const props = {
    web3: context!.web3,
    setWeb3: setWeb3,
  };

  return props;
};

export default Web3StateProvider;
// exports useLoader = useLoader;
