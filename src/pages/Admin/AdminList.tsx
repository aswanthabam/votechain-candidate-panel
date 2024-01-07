import React, { useEffect } from "react";
import { useContracts } from "../../hooks/useContracts";
import { ContractExecutionError } from "web3";
import { AdminInfo, adminInfoFromList } from "../../utils/types";
import { useDialog } from "../../hooks/useDialog";
import { useWeb3 } from "../../hooks/useWeb3";
// import { VerifyVoterInfoPage } from "./VerifyVoterInfoPage";

const AdminList = () => {
  const { contracts } = useContracts();
  const { setDialog, showDialog } = useDialog();
  const [adminList, setAdminList] = React.useState<AdminInfo[] | null>([]);

  const { web3 } = useWeb3();
  useEffect(() => {
    (window as any).contracts = contracts;
    (contracts.permissions?.methods as any)
      .getAllAdmins()
      .call({
        from: web3.eth.accounts.wallet[0].address,
      })
      .then((res: any) => {
        console.log(res);
        var regs: AdminInfo[] = res.map(
          (admin: any) => adminInfoFromList(admin) ?? null
        );
        console.log(regs);
        setAdminList(regs);
      })
      .catch((err: ContractExecutionError) => {
        console.log(err);
        console.log(err.message);
        setDialog(
          <h1>
            There was an error interacting with blockchain, please try again
            later.
          </h1>
        );
        showDialog();
      });
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold">Admins List</h1>
      <div className="overflow-x-auto mt-10">
        <p className="text-wrap text-lg mb-10">
          Here is the list of all admins who is registered and verified
        </p>
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Role</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {adminList?.map((admin, index) => {
              return (
                admin && (
                  <tr>
                    <th>{index + 1}</th>
                    <td>{admin.name}</td>
                    <td>{admin.role}</td>
                    <td>
                      <button
                        className="btn btn-link"
                        onClick={() => {
                          //   handleVerifyClick(voter);
                          console.log("Not implemented");
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
        {/* <div className="modal-box">{verifyContent}</div> */}
      </dialog>
    </div>
  );
};
export default AdminList;
