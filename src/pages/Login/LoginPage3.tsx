import React, { useEffect, useState } from "react";
import { Party } from "../../utils/types";
import { getParties } from "../../services/api_services/candidate";
import { useSystemSettings } from "../../hooks/useSystemSettings";

interface LoginPage3Props {
  prev: () => void;
  onSubmit: (partyId: Party | null, logo: File | null) => void;
}

export const LoginPage3: React.FC<LoginPage3Props> = ({ onSubmit, prev }) => {
  const [parties, setParties] = React.useState<Party[] | null>(null);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  var [logo, setLogo] = useState<File | null>(null);
  const { systemSettings } = useSystemSettings();
  useEffect(() => {
    console.log("LoginPage3 mounted");
    getParties(systemSettings?.localServer ?? "").then((res) => {
      console.log(res);
      if (res) {
        setParties(res);
      }
    });
    return () => {
      console.log("LoginPage3 unmounted");
    };
  }, []);

  const [logoData, setLogoData] = React.useState<string | null>(null);
  useEffect(() => {
    if (logo) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var dataURL = e.target?.result as string;
        setLogoData(dataURL);
      };
      reader.readAsDataURL(logo);
    }
  }, [logo]);
  return (
    <div className="flex flex-col items-center h-auto *:pt-0 justify-start gap-10 w-full pb-10">
      <div className="flex justify-start w-full gap-5">
        <button className="btn btn-neutral rounded-none" onClick={prev}>
          {" "}
          &lt; Go back
        </button>
      </div>
      <h1 className="text-5xl font-bold text-center">Select your party</h1>
      <p>
        If you are participaing in the election representing a party, please
        select the party else choose independent.
      </p>
      <select
        onChange={(e) => {
          var c =
            parties?.find((party) => party.partyId === e.target.value) ?? null;
          if (c != null && c?.name == "Independent") {
            c = null;
          }
          setSelectedParty(c);
          setLogo(null);
        }}
        className="select select-bordered w-full max-w-xs"
      >
        <option disabled selected>
          Select Party *
        </option>
        {parties?.map((party) => (
          <option value={party.partyId}>{party.name}</option>
        ))}
      </select>
      {!selectedParty && (
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs mt-5"
          placeholder="Upload Logo"
          onChange={(e) => {
            console.log(e.target.files![0]);
            logo = e.target.files![0];
            setLogo(e.target.files![0]);
            console.log(logo);
          }}
        />
      )}
      {(selectedParty || logo) && (
        <>
          <h1 className="font-bold underline underline-offset-8">
            Party Details
          </h1>
          <div className="overflow-x-auto w-full gap-5 flex-col flex h-full">
            <div className="flex items-center w-full gap-10">
              <img
                src={
                  logo
                    ? (logoData as string)
                    : ((systemSettings!.localServer +
                        selectedParty?.logo) as string)
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
                    <td>{selectedParty?.partyId ?? "Indepentent"}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{selectedParty?.name ?? "Indepentent"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      <button
        onClick={() => {
          onSubmit(selectedParty, logo);
        }}
        className="btn btn-primary"
      >
        Save & Continue
      </button>
    </div>
  );
};
