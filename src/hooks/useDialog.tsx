import React, { ReactNode, createContext, useContext, useState } from "react";

interface DialogState {
  child: ReactNode | null;
  status: boolean;
  buttons: ReactNode[] | JSX.Element[] | null;
  setStatus: React.Dispatch<
    React.SetStateAction<{
      child: ReactNode;
      status: boolean;
      buttons: ReactNode[] | JSX.Element[] | null;
    }>
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
    buttons: ReactNode[] | JSX.Element[] | null;
  }>({
    child: null,
    status: false,
    buttons: null,
  });
  const DialogState: DialogState = {
    child: status.child,
    status: status.status,
    buttons: status.buttons,
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
    context!.setStatus({
      child: context!.child,
      status: context!.status,
      buttons: context!.buttons,
    });
  }
  function setButtons(buttons: ReactNode[] | JSX.Element[] | null) {
    context!.buttons = buttons;
    context!.setStatus({
      child: context!.child,
      status: context!.status,
      buttons: context!.buttons,
    });
  }
  function showDialog() {
    (document.getElementById("my_modal_1")! as any).showModal();
    context!.setStatus({
      child: context!.child,
      status: true,
      buttons: context!.buttons,
    });
  }
  function hideDialog() {
    (document.getElementById("my_modal_1")! as any).close();
    context!.setStatus({
      child: context!.child,
      status: false,
      buttons: context!.buttons,
    });
  }
  const props = {
    child: context!.child,
    status: context!.status,
    buttons: context!.buttons,
    setDialog,
    showDialog,
    setButtons,
    hideDialog,
  };

  return props;
};

export default DialogStateProvider;
// exports useLoader = useLoader;
