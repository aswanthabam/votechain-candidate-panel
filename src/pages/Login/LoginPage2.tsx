import React from "react";
import { VoterInfo } from "../../utils/types";

interface LoginPage2Props {
  info: VoterInfo;
  onConfirm: () => void;
}

export const LoginPage2: React.FC<LoginPage2Props> = ({ info, onConfirm }) => {
  console.log(info);
  return (
    <div className="flex flex-col items-center h-full pt-20 justify-start gap-10 w-full pb-10">
      <h1 className="text-5xl font-bold text-center">Confirm Your Details</h1>
      <p>
        If there is any mistake, you want to change the details by going to
        nearest office,
      </p>
      <div className="flex flex-col items-start justify-start gap-5 w-full">
        <h1 className="font-bold underline underline-offset-8">
          Personal Details
        </h1>
        <div className="overflow-x-auto w-full gap-5 flex-col flex">
          <table className="table w-full table-zebra">
            <tbody>
              <tr>
                <th>Aadhar Number</th>
                <td>{info.aadhar_number}</td>
              </tr>
              <tr>
                <th>First Name</th>
                <td>{info.personal_info.first_name}</td>
              </tr>
              <tr>
                <th>Middle Name</th>
                <td>{info.personal_info.middle_name}</td>
              </tr>
              <tr>
                <th>Last Name</th>
                <td>{info.personal_info.last_name}</td>
              </tr>
              <tr>
                <th>Date Of Birth</th>
                <td>{new Date(info.personal_info.dob).toDateString()}</td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td>{info.contact_info.phone}</td>
              </tr>
              <tr>
                <th>Email ID</th>
                <td>{info.contact_info.email}</td>
              </tr>
              <tr>
                <th>Married</th>
                <td>{info.married ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <th>Orphan</th>
                <td>{info.orphan ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>
          <h1 className="font-bold underline underline-offset-8">
            Permenant Address
          </h1>
          <table className="table w-full table-zebra">
            <tbody>
              <tr>
                <th>State</th>
                <td>{info.permenant_address.state}</td>
              </tr>
              <tr>
                <th>District</th>
                <td>{info.permenant_address.district}</td>
              </tr>
              <tr>
                <th>Locality</th>
                <td>{info.permenant_address.locality}</td>
              </tr>
              <tr>
                <th>Ward</th>
                <td>{info.permenant_address.ward}</td>
              </tr>
              <tr>
                <th>House Name</th>
                <td>{info.permenant_address.house_name}</td>
              </tr>
              <tr>
                <th>House Number</th>
                <td>{info.permenant_address.house_number}</td>
              </tr>
              <tr>
                <th>Street</th>
                <td>{info.permenant_address.street}</td>
              </tr>
              <tr>
                <th>Pincode</th>
                <td>{info.permenant_address.pincode}</td>
              </tr>
            </tbody>
          </table>
          <h1 className="font-bold underline underline-offset-8">
            Residential Address
          </h1>
          <table className="table w-full table-zebra">
            <tbody>
              <tr>
                <th>State</th>
                <td>{info.current_address.state}</td>
              </tr>
              <tr>
                <th>District</th>
                <td>{info.current_address.district}</td>
              </tr>
              <tr>
                <th>Locality</th>
                <td>{info.current_address.locality}</td>
              </tr>
              <tr>
                <th>Ward</th>
                <td>{info.current_address.ward}</td>
              </tr>
              <tr>
                <th>House Name</th>
                <td>{info.current_address.house_name}</td>
              </tr>
              <tr>
                <th>House Number</th>
                <td>{info.current_address.house_number}</td>
              </tr>
              <tr>
                <th>Street</th>
                <td>{info.current_address.street}</td>
              </tr>
              <tr>
                <th>Pincode</th>
                <td>{info.current_address.pincode}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button onClick={onConfirm} className="btn btn-primary mb-10">
          Confirm
        </button>
      </div>
    </div>
  );
};
