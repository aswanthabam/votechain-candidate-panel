import { useEffect } from "react";

const Home = () => {
  useEffect(() => {}, []);
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Home</h1>
      <div className="flex w-full gap-10 mt-10">
        <button className="btn">
          {/* <span>{registeredVoterCount}</span> Voters Registered */}
        </button>
        <button className="btn">
          {/* <span>{voterCount}</span> Verified Voters */}
        </button>
      </div>
    </div>
  );
};

export default Home;
