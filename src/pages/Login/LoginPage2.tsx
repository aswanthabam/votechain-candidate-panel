import React from "react";
import {
  Constituency,
  District,
  Election,
  State,
  VoterInfo,
} from "../../utils/types";
import {
  getConstituencies,
  getDistricts,
} from "../../services/api_services/location";

interface LoginPage2Props {
  info: VoterInfo;
  states: State[];
  districts: District[];
  constituencies: Constituency[];
  // constituency: Constituency | null;
  setDistricts: React.Dispatch<React.SetStateAction<District[]>>;
  setConstituencies: React.Dispatch<React.SetStateAction<Constituency[]>>;
  setConstituency: React.Dispatch<React.SetStateAction<Constituency | null>>;
  election: Election | null;
  onSubmit: () => void;
  onChange: (constituency: Constituency) => void;
}

export const LoginPage2: React.FC<LoginPage2Props> = ({
  info,
  onSubmit,
  states,
  districts,
  constituencies,
  setDistricts,
  setConstituencies,
  setConstituency,
  election,
  onChange,
}) => {
  console.log(info);
  return (
    <div className="flex flex-col items-center h-full pt-20 justify-start gap-10 w-full pb-10">
      <h1 className="text-5xl font-bold text-center">Select Constituency</h1>
      <p>
        Here you want to select the constituency you want to register as a
        candidate.
      </p>
      <div className="flex flex-col items-center justify-start gap-5 w-full">
        <select
          onChange={(e) => {
            getDistricts(null, e.target.value).then((res) => {
              setDistricts(res ? res : []);
            });
          }}
          className="select select-bordered w-full max-w-xs"
        >
          <option disabled selected>
            Select State *
          </option>
          {states.map((state) => (
            <option value={state.id}>{state.name}</option>
          ))}
        </select>
        <select
          onChange={(e) => {
            getConstituencies(null, e.target.value).then((res) => {
              setConstituencies(res ? res : []);
            });
          }}
          className="select select-bordered w-full max-w-xs"
        >
          <option disabled selected>
            Select District *
          </option>
          {districts.map((state) => (
            <option value={state.id}>{state.name}</option>
          ))}
        </select>
        <select
          onChange={(e) => {
            var c =
              constituencies.find(
                (constituency) => constituency.id === e.target.value
              ) ?? null;
            setConstituency(c);
            onChange(c!);
          }}
          className="select select-bordered w-full max-w-xs"
        >
          <option disabled selected>
            Select Constituency *
          </option>
          {constituencies.map((state) => (
            <option value={state.id}>{state.name}</option>
          ))}
        </select>
        {election && (
          <>
            <h1 className="text-2xl font-bold text-center">
              Active Election in this constituency
            </h1>
            <h2>
              {election.name} (ID : {election.id.toString()})
            </h2>
            <h2>About Election : {election.description}</h2>
            <h2>Start On : {election.start_date.toLocaleString()}</h2>
            <h2>End On : {election.end_date.toLocaleString()}</h2>
            <button className="btn btn-primary mb-10" onClick={onSubmit}>
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
};
