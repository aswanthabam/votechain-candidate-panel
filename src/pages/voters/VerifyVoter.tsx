import React, { useEffect } from "react";
import { useContracts } from "../../hooks/useContracts";
import { useWeb3 } from "../../hooks/useWeb3";
import { ContractExecutionError } from "web3";
import {
  VoterRegistration,
  voterRegistrationFromList,
} from "../../utils/types";
import { useDialog } from "../../hooks/useDialog";
import { VerifyVoterInfoPage } from "./VerifyVoterInfoPage";

const VerifyVoter = () => {
  const { contracts } = useContracts();
  const { setDialog, showDialog } = useDialog();
  const [voterList, setVoterList] = React.useState<VoterRegistration[] | null>(
    []
  );
  const [verifyContent, setVerifyContent] =
    React.useState<React.ReactNode | null>();
  const [verifying, setVerifying] = React.useState(false);
  const { web3 } = useWeb3();

  const verify = (voter: VoterRegistration) => {
    setVerifying(true);
    (contracts.voter?.methods as any)
      .updateVoterStatus(voter.voter_id, 1)
      .send({ from: web3.eth.accounts.wallet[0].address })
      .then((res: any) => {
        console.log(res);
        setVerifying(false);
        (document.getElementById("voter_details_model") as any).close();
      })
      .catch((err: ContractExecutionError) => {
        console.log(err);
        console.log(err.message);
        setVerifying(false);
        setDialog(
          <h1>
            There was an error interacting with blockchain, please try again
            later.
          </h1>
        );
        showDialog();
      });
  };
  const handleVerifyClick = (voter: VoterRegistration) => {
    console.log(voter);
    setVerifyContent(
      VerifyVoterInfoPage({
        voter,
        close: () => {
          (document.getElementById("voter_details_model") as any).close();
        },
        verifying: verifying,
        verify,
      })
    );
    (document.getElementById("voter_details_model") as any).showModal();
  };

  useEffect(() => {
    (window as any).contracts = contracts;
    (contracts.voterReader?.methods as any)
      .getUnverifiedVoters(10)
      .call()
      .then((res: any) => {
        var regs: VoterRegistration[] = res.map((voter: any) =>
          voterRegistrationFromList(voter)
            ? voterRegistrationFromList(voter)
            : null
        );
        setVoterList(regs);
      })
      .catch((err: ContractExecutionError) => {
        console.log(err);
        console.log(err.message);
      });
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold">Verify Voter</h1>
      <div className="overflow-x-auto mt-10">
        <p className="text-wrap text-lg mb-10">
          Here is the list of all voters who is registered and waiting for their
          profile verification, verify their details respect to the documents
          and approve them. their profile will be only activated if you approved
        </p>
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Aadhar Number</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Location</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {voterList?.map((voter, index) => {
              return (
                voter && (
                  <tr>
                    <th>{index + 1}</th>
                    <td>
                      {voter.voter_info.personal_info.first_name}{" "}
                      {voter.voter_info.personal_info.middle_name}{" "}
                      {voter.voter_info.personal_info.last_name}
                    </td>
                    <td>{voter.voter_info.aadhar_number}</td>
                    <td>{voter.voter_info.contact_info.phone}</td>
                    <td>
                      {new Date(
                        voter.voter_info.personal_info.dob
                      ).toDateString()}
                    </td>
                    <td>
                      {voter.voter_info.permenant_address.locality},{" "}
                      {voter.voter_info.permenant_address.district},{" "}
                      {voter.voter_info.permenant_address.state},{" "}
                      {voter.voter_info.permenant_address.pincode}
                    </td>
                    <td>
                      <button
                        className="btn btn-link"
                        onClick={() => {
                          handleVerifyClick(voter);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-center mt-10">
          <div className="join">
            <button className="join-item btn">1</button>
            <button className="join-item btn">2</button>
            <button className="join-item btn btn-disabled">...</button>
            <button className="join-item btn">99</button>
            <button className="join-item btn">100</button>
          </div>
        </div>
      </div>
      <dialog id="voter_details_model" className="modal">
        <div className="modal-box">{verifyContent}</div>
      </dialog>
    </div>
  );
};
export default VerifyVoter;
