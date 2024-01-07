import React from "react";

interface SuccessLoginProps {}
export const SuccessLogin: React.FC<SuccessLoginProps> = ({}) => {
  return (
    <div className="flex items-center h-full pt-20 justify-center gap-20">
      <div className="flex h-full items-center flex-col justify-center text-center w-auto">
        <h1 className="text-5xl font-bold mb-10 text-center">
          Successfuly Submited Nomination{" "}
        </h1>
        <p className="w-80">
          Check agin later to see if your nomination is accepted, all the best
          on your upcoming election.
        </p>
      </div>{" "}
    </div>
  );
};
