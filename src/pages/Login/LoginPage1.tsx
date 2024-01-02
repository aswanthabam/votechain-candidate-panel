import React from "react";
import QRCode from "react-qr-code";
interface LoginPage1Props {
  code: string | null;
  codeScanned: boolean;
}
export const LoginPage1: React.FC<LoginPage1Props> = ({
  code,
  codeScanned,
}) => {
  return (
    <div className="flex items-center h-full pt-20 justify-center gap-20">
      <div className="flex h-full items-center flex-col justify-center text-center w-auto">
        <h1 className="text-5xl font-bold mb-10 text-center">
          Submit Nomination
        </h1>
        <p className="w-80">
          For submitting your nomination, you need to scan the QR code with your
          votechain app to continue. make sure the votechain app is open until
          you complete the registration with a good netword connection.
        </p>
      </div>
      <div className="flex justify-center items-center flex-col">
        <>
          <p className="text-center">
            Scan the below QR Code with the votechain app
          </p>
          <div className="flex justify-center items-center w-auto m-auto mt-10 p-10 bg-white rounded-2xl">
            {code &&
              (codeScanned ? (
                <span className="loading loading-infinity loading-lg"></span>
              ) : (
                <QRCode value={code} />
              ))}
          </div>
        </>
      </div>
    </div>
  );
};
