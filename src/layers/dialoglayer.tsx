import React from "react";
import { useDialog } from "../hooks/useDialog";

interface Web3ProviderProps {
  children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
}

export const DialogLayer: React.FC<Web3ProviderProps> = ({ children }) => {
  const { child, buttons } = useDialog();
  return (
    <>
      <dialog id="my_modal_1" className="modal z-10">
        <div className="modal-box">
          {child}
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              {buttons ? (
                <>{buttons.map((btn) => btn)}</>
              ) : (
                <button className="btn">Close</button>
              )}
            </form>
          </div>
        </div>
      </dialog>
      {children}
    </>
  );
};
