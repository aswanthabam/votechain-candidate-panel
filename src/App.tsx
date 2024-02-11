import { Route, Routes } from "react-router-dom";
import "./App.css";
import ContractStateProvider from "./hooks/useContracts";
import DialogStateProvider from "./hooks/useDialog";
import SystemSettingsProvider from "./hooks/useSystemSettings";
import Web3StateProvider from "./hooks/useWeb3";
import MainLayer from "./layers/mainlayer";
import { Login } from "./pages/Login/Login";
import { Dashboard } from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <Web3StateProvider>
      <SystemSettingsProvider>
        <ContractStateProvider>
          {/* <KeyStateProvider> */}
          <DialogStateProvider>
            <MainLayer>
              <Routes>
                <Route path="/">
                  <Route path="/" element={<Login />} />
                  <Route path="/dashboard">
                    <Route path="" element={<Dashboard />} />
                  </Route>
                  <Route path="*" element={<h1>Unknown Page</h1>} />
                </Route>
              </Routes>
            </MainLayer>
          </DialogStateProvider>
          {/* </KeyStateProvider> */}
        </ContractStateProvider>
      </SystemSettingsProvider>
    </Web3StateProvider>
  );
}

export default App;
