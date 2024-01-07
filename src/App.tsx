import { Route, Routes } from "react-router-dom";
import "./App.css";
import ContractStateProvider from "./hooks/useContracts";
import DialogStateProvider from "./hooks/useDialog";
import SystemSettingsProvider from "./hooks/useSystemSettings";
import Web3StateProvider from "./hooks/useWeb3";
import MainLayer from "./layers/mainlayer";
import { Login } from "./pages/Login/Login";

function App() {
  return (
    <Web3StateProvider>
      <SystemSettingsProvider>
        <ContractStateProvider>
          {/* <KeyStateProvider> */}
          <DialogStateProvider>
            <Routes>
              <Route path="/" element={<MainLayer />}>
                <Route path="/" element={<Login />} />
                <Route path="*" element={<h1>Unknown Page</h1>} />
              </Route>
            </Routes>
          </DialogStateProvider>
          {/* </KeyStateProvider> */}
        </ContractStateProvider>
      </SystemSettingsProvider>
    </Web3StateProvider>
  );
}

export default App;
