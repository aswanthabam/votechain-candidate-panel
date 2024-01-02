import { ReactNode, createContext, useContext, useState } from "react";
import { Contracts } from "../utils/types";

interface ContractState {
  contracts: Contracts;
  setStatus: React.Dispatch<React.SetStateAction<{ contracts: Contracts }>>;
}

const ContractStateContext = createContext<ContractState | undefined>(
  undefined
);

interface ContractStateProviderProps {
  children: ReactNode;
}

export const ContractStateProvider: React.FC<ContractStateProviderProps> = ({
  children,
}) => {
  const [status, setStatus] = useState<{ contracts: Contracts }>({
    contracts: {
      voter: null,
      voterReader: null,
      candidate: null,
      votechain: null,
      permissions: null,
      linker: null,
    },
  });
  const ContractState: ContractState = {
    contracts: status.contracts,
    setStatus,
  };

  return (
    <ContractStateContext.Provider value={ContractState}>
      {children}
    </ContractStateContext.Provider>
  );
};

export const useContracts = () => {
  const context = useContext(ContractStateContext);
  if (!context) {
    throw new Error(
      "useContractState must be used within a SharedStateProvider"
    );
  }
  function setContracts(w: Contracts) {
    context!.contracts = w;
    context!.setStatus({ contracts: context!.contracts });
  }
  const props = {
    contracts: context!.contracts,
    setContracts,
  };

  return props;
};

export default ContractStateProvider;
