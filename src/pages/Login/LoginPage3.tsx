import React from "react";
import { VoterInfo } from "../../utils/types";

interface LoginPage2Props {
  info: VoterInfo;
  onSubmit: () => void;
}

export const LoginPage3: React.FC<LoginPage2Props> = ({ info, onSubmit }) => {
  console.log(info);
  return (
    <div className="flex flex-col items-center h-full pt-20 justify-start gap-10 w-full pb-10">
      <h1 className="text-5xl font-bold text-center">Select Constituency</h1>
      <p>
        Here you want to select the constituency you want to register as a
        candidate.
      </p>
      <div className="flex flex-col items-center justify-start gap-5 w-full">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Select State *</span>
          </div>
          <input
            type="text"
            placeholder="State"
            value={info.permenant_address.state}
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Select District *</span>
          </div>
          <input
            type="text"
            placeholder="District"
            value={info.permenant_address.district}
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Select Constituency *</span>
          </div>
          <input
            type="text"
            placeholder="Constituency"
            className="input input-bordered w-full max-w-xs"
          />
        </label>
        <button className="btn btn-primary mb-10" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};
