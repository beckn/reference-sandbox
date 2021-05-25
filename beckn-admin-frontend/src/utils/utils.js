import { store } from "../redux/store";
import { clearAuth } from "../redux/auth/actions";

export function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
    : baseURL;
}

export const getErrorFromResponse = (error) => {
  if (error.response) {
    if (error?.response?.status === 401) {
      store.dispatch(clearAuth());
    }
    if (error?.response?.data) {
      if (error?.response?.data?.message) {
        return { status: "error", message: error.response.data.message };
      }
      return { status: "error", message: error.response.data };
    }
  }
  return { status: "error", message: error.message };
};

export const getAuthToken = () => {
  const state = store.getState();
  const authToken = state.auth.token;
  return authToken;
};
