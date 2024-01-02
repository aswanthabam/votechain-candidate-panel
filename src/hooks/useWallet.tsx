// import { ReactNode, createContext, useContext, useState } from "react";
// import { Contracts } from "../utils/types";

// interface WalletState {
//   wallet: ;
//   setStatus: React.Dispatch<React.SetStateAction<{ wallet:  }>>;
// }

// const WalletStateContext = createContext<WalletState | undefined>(undefined);

// interface WalletStateProviderProps {
//   children: ReactNode;
// }

// export const WalletStateProvider: React.FC<WalletStateProviderProps> = ({
//   children,
// }) => {
//   const [status, setStatus] = useState<{ wallet:  }>({
//     contracts: {
//       voter: null,
//       voterReader: null,
//       candidate: null,
//       votechain: null,
//       permissions: null,
//       linker: null,
//     },
//   });
//   const WalletState: WalletState = {
//     contracts: status.contracts,
//     setStatus,
//   };

//   return (
//     <WalletStateContext.Provider value={WalletState}>
//       {children}
//     </WalletStateContext.Provider>
//   );
// };

// export const useContracts = () => {
//   const context = useContext(WalletStateContext);
//   if (!context) {
//     throw new Error("useWalletState must be used within a SharedStateProvider");
//   }
//   function setContracts(w: Contracts) {
//     context!.contracts = w;
//     context!.setStatus({ contracts: context!.contracts });
//   }
//   const props = {
//     contracts: context!.contracts,
//     setContracts,
//   };

//   return props;
// };

// export default WalletStateProvider;
export default {};
