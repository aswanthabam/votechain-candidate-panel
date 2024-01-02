import { ReactNode, createContext, useContext, useState } from "react";
import { SystemConfig } from "../utils/types";

interface SystemSettings {
  systemSettings: SystemConfig | null;
  setStatus: React.Dispatch<
    React.SetStateAction<{ systemSettings: SystemConfig | null }>
  >;
}

const SystemSettingsContext = createContext<SystemSettings | undefined>(
  undefined
);

interface SystemSettingsProviderProps {
  children: ReactNode;
}

export const SystemSettingsProvider: React.FC<SystemSettingsProviderProps> = ({
  children,
}) => {
  const [status, setStatus] = useState<{ systemSettings: SystemConfig | null }>(
    {
      systemSettings: null,
    }
  );
  const SystemSettings: SystemSettings = {
    systemSettings: status.systemSettings,
    setStatus: setStatus,
  };

  return (
    <SystemSettingsContext.Provider value={SystemSettings}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

export const useSystemSettings = () => {
  const context = useContext(SystemSettingsContext);
  if (!context) {
    throw new Error(
      "useSystemSettings must be used within a SharedStateProvider"
    );
  }
  function setSystemSettings(w: SystemConfig) {
    context!.systemSettings = w;
    context!.setStatus({ systemSettings: context!.systemSettings });
  }
  const props = {
    systemSettings: context!.systemSettings,
    setSystemSettings,
  };

  return props;
};

export default SystemSettingsProvider;
