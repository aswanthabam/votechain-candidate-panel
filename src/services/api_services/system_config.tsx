import { SystemConfig } from "../../utils/types";
import { publicRouter } from "./api";

export const getSystemConfig = async (): Promise<SystemConfig | null> => {
  try {
    const response = await publicRouter.get("/api/system/config");
    if (
      response.status === 200 &&
      response.data &&
      response.data.status === "success"
    ) {
      return response.data.data[0] as SystemConfig;
    }
    return null;
  } catch (err) {
    return null;
  }
};
