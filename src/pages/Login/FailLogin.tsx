import React from "react";

interface FailLoginProps {}
export const FailLogin: React.FC<FailLoginProps> = ({}) => {
  return (
    <div className="flex items-center h-full pt-20 justify-center gap-20">
      <div className="flex h-full items-center flex-col justify-center text-center w-auto">
        <h1 className="text-5xl font-bold mb-10 text-center">
          Failed to Submit Nomination{" "}
        </h1>
        <p className="w-80">
          There was an error submitting the nomination, please try again later.
          if the issue still persists, please contact the{" "}
          <a href="tel:9999999999">support team</a>.
        </p>
      </div>{" "}
    </div>
  );
};
