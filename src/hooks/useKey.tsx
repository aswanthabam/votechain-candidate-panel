import { ReactNode, createContext, useState } from "react";

interface KeyState {
  key: String | null;
  setStatus: React.Dispatch<React.SetStateAction<{ key: String | null }>>;
}

const KeyStateContext = createContext<KeyState | undefined>(undefined);

interface KeyStateProviderProps {
  children: ReactNode;
}

export const KeyStateProvider: React.FC<KeyStateProviderProps> = ({
  children,
}) => {
  const [status, setStatus] = useState<{ key: String | null }>({
    key: null,
  });
  const KeyState: KeyState = {
    key: status.key,
    setStatus,
  };

  return (
    <KeyStateContext.Provider value={KeyState}>
      {children}
    </KeyStateContext.Provider>
  );
};

// export const useKey = () => {
//   const context = useContext(KeyStateContext);
//   if (!context) {
//     throw new Error("useKeyState must be used within a SharedStateProvider");
//   }
//   function setKey(w: String | null) {
//     context!.key = w;
//     context!.setStatus({ key: context!.key });
//   }
//   const props = {
//     key: context!.key,
//     setKey,
//   };

//   return props;
// };

export default KeyStateProvider;
