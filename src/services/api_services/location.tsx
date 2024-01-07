import { Constituency, District, State } from "../../utils/types";
import { publicRouter } from "./api";

export const getDistricts = async (
  search: string | null = null,
  state_id: string | null = null
): Promise<District[] | null> => {
  try {
    const response = await publicRouter.get(
      "/api/location/districts/list/?" +
        (search ? `search=${search}` : "") +
        (state_id ? `&state_id=${state_id}` : "")
    );
    if (
      response.status === 200 &&
      response.data &&
      response.data.status === "success"
    ) {
      return response.data.data as District[];
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const getStates = async (
  search: string | null = null
): Promise<State[] | null> => {
  try {
    const response = await publicRouter.get(
      "/api/location/states/list/" + (search ? `?search=${search}` : "")
    );
    if (
      response.status === 200 &&
      response.data &&
      response.data.status === "success"
    ) {
      return response.data.data as State[];
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const getConstituencies = async (
  search: string | null = null,
  district_id: string | null = null
): Promise<Constituency[] | null> => {
  try {
    const response = await publicRouter.get(
      "/api/location/constituencies/list/?" +
        (search ? `search=${search}` : "") +
        (district_id ? `&district_id=${district_id}` : "")
    );
    if (
      response.status === 200 &&
      response.data &&
      response.data.status === "success"
    ) {
      console.log(response.data.data[0]);
      return response.data.data as Constituency[];
    }
    return null;
  } catch (err) {
    return null;
  }
};
