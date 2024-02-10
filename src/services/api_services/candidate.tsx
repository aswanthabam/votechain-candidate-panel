import { CandidateProfile } from "../../utils/types";
import { publicRouter } from "./api";

export const getCandidateProfile = async (
  endpoint: string
): Promise<CandidateProfile | null> => {
  try {
    const response = await publicRouter.get(
      endpoint +
        "/api/candidate/profile/?ACCESS_KEY=" +
        localStorage.getItem("access_key")
    );
    if (
      response.status === 200 &&
      response.data &&
      response.data.status === "success"
    ) {
      return response.data.data as CandidateProfile;
    }
    return null;
  } catch (err) {
    return null;
  }
};
