import React, { useEffect } from "react";
import { Constituency, Party, VoterInfo } from "../../utils/types";
import { useSystemSettings } from "../../hooks/useSystemSettings";

interface LoginPage4Props {
  info: VoterInfo;
  constituency: Constituency;
  party: Party | null;
  logo: File | null;
  prev: () => void;
  onConfirm: () => void;
}

export const LoginPage4: React.FC<LoginPage4Props> = ({
  info,
  party,
  logo,
  prev,
  onConfirm,
  constituency,
}) => {
  const { systemSettings } = useSystemSettings();
  const [logoData, setLogoData] = React.useState<string | null>(null);
  const [confirmed, setConfirmed] = React.useState(false);
  useEffect(() => {
    console.log("LoginPage4 mounted");
    if (logo) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var dataURL = e.target?.result as string;
        setLogoData(dataURL);
      };
      reader.readAsDataURL(logo);
    }
    return () => {
      console.log("LoginPage4 unmounted");
    };
  }, [logo]);
  return (
    <div className="flex flex-col items-center h-full pt-0 justify-start gap-10 w-full pb-10">
      <div className="flex justify-start w-full gap-5">
        <button className="btn btn-neutral rounded-none" onClick={prev}>
          {" "}
          &lt; Go back
        </button>
      </div>
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
        <h1 className="font-bold underline underline-offset-8">
          Constituency Details
        </h1>
        <div className="overflow-x-auto w-full gap-5 flex-col flex">
          <table className="table w-full table-zebra">
            <tbody>
              <tr>
                <th>ID</th>
                <td>{constituency.id}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{constituency.name}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h1 className="font-bold underline underline-offset-8">
          Party Details
        </h1>
        <div className="overflow-x-auto w-full gap-5 flex-col flex">
          <div className="flex items-center w-full gap-10">
            <img
              src={
                logo
                  ? (logoData as string)
                  : ((systemSettings!.localServer + party?.logo) as string)
              }
              style={{
                width: 100,
                height: 100,
                margin: 0,
                padding: 0,
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
            <table
              style={{ width: "calc(100% - 150px)" }}
              className="table table-zebra"
            >
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{party?.partyId ?? "Indepentent"}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{party?.name ?? "Indepentent"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            onClick={() => {
              onConfirm();
              setConfirmed(true);
            }}
            className="btn btn-primary mb-10"
          >
            Confirm and Register{" "}
            {confirmed && (
              <span className="loading loading-dots loading-xs"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
