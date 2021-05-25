import axios from "axios";
import { config } from "../config/config";
import { combineURLs, getErrorFromResponse, getAuthToken } from "./utils";

export const getNetworkSettings = async () => {
  try {
    const response = await axios({
      method: "get",
      url: combineURLs(config.backend_url, "/settings"),
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      },
    });
    return { status: "complete", data: response.data };
  } catch (error) {
    return getErrorFromResponse(error);
  }
};

export const setNetworkSettings = async (data) => {
  try {
    const response = await axios({
      method: "post",
      url: combineURLs(config.backend_url, "/settings"),
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      },
      data,
    });
    return { status: "complete", data: response.data };
  } catch (error) {
    return getErrorFromResponse(error);
  }
};
