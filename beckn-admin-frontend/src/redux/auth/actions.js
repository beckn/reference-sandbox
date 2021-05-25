import { store } from "../store";
import { login, logout } from "../../utils/auth"

export const fetchAuthStarted = (username) => ({
  type: "FETCH_AUTH_START",
  payload: username,
});

export const fetchAuthSuccess = (token) => ({
  type: "FETCH_AUTH_SUCCESS",
  payload: token,
});

export const fetchAuthError = (error) => ({
  type: "FETCH_AUTH_ERROR",
  payload: error,
});

export const clearAuth = () => ({
  type: "CLEAR_AUTH",
});

export const fetchAuth = (data) => {
  return async (dispatch) => {
    store.dispatch(fetchAuthStarted(data.email));
    try {
      let response = await login(data);
      if (response.status === "complete") {
        store.dispatch(fetchAuthSuccess(response.data.token));
      } else {
        store.dispatch(fetchAuthError(response.message));
      }
    } catch (error) {
      console.log("ERR!!!!",error);
      store.dispatch(fetchAuthError(error));
    }
  };
};

export const doLogout = () => {
  return async (dispatch) => {
    try {
      await logout();
      store.dispatch(clearAuth());
    } catch (error) {
      store.dispatch(clearAuth());
    }
  };
};
