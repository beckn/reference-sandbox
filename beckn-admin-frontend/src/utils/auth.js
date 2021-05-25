import axios from "axios";
import { config } from "../config/config";
import { combineURLs, getErrorFromResponse, getAuthToken } from "./utils";

export const login = async (data) => {
  try {
    const response = await axios({
      method: "post",
      url: combineURLs(config.backend_url, "/user/login"),
      data,
    });
    return { status: "complete", data: response.data };
  } catch (error) {
    if (error?.response?.status === 401) {
      return { status: "error", message: "Authentication Failed" };
    }
    return getErrorFromResponse(error);
  }
};

export const logout = async () => {
  try {
    const response = await axios({
      method: "post",
      url: combineURLs(config.backend_url, "/user/logout"),
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      },
    });
    return { status: "complete", data: response.data };
  } catch (error) {
    if (error.response.status === 401) {
      return { status: "error", message: "Authentication Failed" };
    }
    return getErrorFromResponse(error);
  }
};

export const changePassword = async (old_password, new_password) => {
  try {
    const response = await axios({
      method: "post",
      url: combineURLs(config.backend_url, "/user/changePassword"),
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      },
      data: {
        old_password,
        new_password
      }
    });
    return { response };
  } catch (error) {
    console.log(error.response)
    if (error.response.status === 401) {
      return { status: "error", message: "Authentication Failed" };
    }
    return getErrorFromResponse(error);
  }
};
