import React from "react";
import { VoterRegistration } from "../../utils/types";

interface VoterInfoParams {
  voter: VoterRegistration;
  close: () => void;
  verifying: boolean;
  verify: (voter: VoterRegistration) => void;
}
export const VerifyVoterInfoPage: React.FC<VoterInfoParams> = ({
  voter,
  close,
  verifying,
  verify,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
            {/* <th>Job</th> */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>First Name</th>
            <td>{voter.voter_info.personal_info.first_name}</td>
            {/* <td>
                <input type="checkbox" checked={false} className="checkbox" />
              </td> */}
          </tr>
          <tr>
            <th>Middle Name</th>
            <td>{voter.voter_info.personal_info.middle_name}</td>
            {/* <td>
                <input type="checkbox" checked={false} className="checkbox" />
              </td> */}
          </tr>
          <tr>
            <th>Last Name</th>
            <td>{voter.voter_info.personal_info.last_name}</td>
            {/* <td>
                <input type="checkbox" checked={false} className="checkbox" />
              </td> */}
          </tr>
          <tr>
            <th>Date of birth</th>
            <td>
              {new Date(voter.voter_info.personal_info.dob).toDateString()}
            </td>
            {/* <td>
                <input type="checkbox" checked={false} className="checkbox" />
              </td> */}
          </tr>
          <tr>
            <th>First Name</th>
            <td>{voter.voter_info.personal_info.first_name}</td>
            {/* <td>
                <input type="checkbox" checked={false} className="checkbox" />
              </td> */}
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end gap-2">
        <button className="btn" onClick={close}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            verify(voter);
          }}
        >
          {verifying && <span className="loading loading-spinner"></span>}
          Verify Voter
        </button>
      </div>
    </div>
  );
};
