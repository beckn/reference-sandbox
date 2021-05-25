import axios from "axios";
import { config } from "../config/config";
import { combineURLs, getErrorFromResponse, getAuthToken } from "./utils";

export const submitNewPlatformForm = async (data) => {
  try {
    const response = await axios({
      method: "post",
      url: combineURLs(config.backend_url,'/platform'),
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

export const editPlatformForm = async (data) => {
  try {
    const response = await axios({
      method: "put",
      url: combineURLs(config.backend_url,'/platform'),
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

export const deletePlatform = async (id) => {
  try {
    const response = await axios({
      method: "delete",
      url: combineURLs(config.backend_url,'/platform'),
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      },
      data:{id},
    });
    return { status: "complete", data: response.data };
  } catch (error) {
    return getErrorFromResponse(error);
  }
};

export const getAllPlatforms = async () => {
  try {
    const response = await axios({
      method: "get",
      url: combineURLs(config.backend_url,'/platform'),
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return { status: "complete", data: response.data };
  } catch (error) {
    return getErrorFromResponse(error);
  }
};

export const getPlatformSettings = async (url) => {
  try {
    const response = await axios({
      method: "get",
      url: combineURLs(url,'/admin/settings'),
    });
    return { status: "complete", data: response.data };
  } catch (error) {
    return getErrorFromResponse(error);
  }
};

export const setPlatformSettings = async (url, data) => {
  if(data?.delay) {
    data.delay = parseInt(data.delay);
  }
  try {
    const response = await axios({
      method: "post",
      url: combineURLs(url,'/admin/settings'),
      data
    });
    return { status: "complete", data: response.data };
  } catch (error) {
    return getErrorFromResponse(error);
  }
};

export const syncPlatformSettings = async () => {
  try {
    const response = await axios({
      method: "post",
      url: combineURLs(config.backend_url,'/platform/syncAll'),
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      },
    });
    return { status: "complete", data: response.data };
  } catch (error) {
    return getErrorFromResponse(error);
  }
};