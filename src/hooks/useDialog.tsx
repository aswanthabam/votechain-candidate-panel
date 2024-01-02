import React, { ReactNode, createContext, useContext, useState } from "react";

interface DialogState {
  child: ReactNode | null;
  status: boolean;
  setStatus: React.Dispatch<
    React.SetStateAction<{ child: ReactNode; status: boolean }>
  >;
}

const DialogStateContext = createContext<DialogState | undefined>(undefined);

interface DialogStateProviderProps {
  children: ReactNode;
}

export const DialogStateProvider: React.FC<DialogStateProviderProps> = ({
  children,
}) => {
  const [status, setStatus] = useState<{
    child: ReactNode | null;
    status: boolean;
  }>({
    child: null,
    status: false,
  });
  const DialogState: DialogState = {
    child: status.child,
    status: status.status,
    setStatus,
  };

  return (
    <DialogStateContext.Provider value={DialogState}>
      {children}
    </DialogStateContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogStateContext);
  if (!context) {
    throw new Error("useDialogState must be used within a SharedStateProvider");
  }
  function setDialog(child: ReactNode) {
    context!.child = child;
    context!.setStatus({ child: context!.child, status: context!.status });
  }
  function showDialog() {
    (document.getElementById("my_modal_1")! as any).showModal();
    context!.setStatus({ child: context!.child, status: true });
  }
  function hideDialog() {
    context!.setStatus({ child: context!.child, status: false });
  }
  const props = {
    child: context!.child,
    status: context!.status,
    setDialog,
    showDialog,
    hideDialog,
  };

  return props;
};

export default DialogStateProvider;
// exports useLoader = useLoader;
