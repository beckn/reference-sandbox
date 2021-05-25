import { store } from "../store";
import { getNetworkSettings, setNetworkSettings } from "../../utils/networkSettings"

export const fetchNetworkSettingsStarted = () => ({
  type: "FETCH_NETWORK_SETTINGS_START",
});

export const fetchNetworkSettingsSuccess = (settings) => ({
  type: "FETCH_NETWORK_SETTINGS_SUCCESS",
  payload: settings,
});

export const fetchNetworkSettingsError = (error) => ({
  type: "FETCH_NETWORK_SETTINGS_ERROR",
  payload: error,
});

export const fetchNetworkSettings = () => {
  return async (dispatch) => {
    store.dispatch(fetchNetworkSettingsStarted());
    try {
      let response = await getNetworkSettings();
      if(response.status === "complete") {
          store.dispatch(fetchNetworkSettingsSuccess(response.data));
      } else {
          store.dispatch(fetchNetworkSettingsError(response.message));
        }
      } catch (error) {
      store.dispatch(fetchNetworkSettingsError(error));
    }
  };
};

export const submitNetworkSettings = (data) => {
  return async (dispatch) => {
    store.dispatch(fetchNetworkSettingsStarted());
    try {
      let response = await setNetworkSettings(data);
      if(response.status === "complete") {
          store.dispatch(fetchNetworkSettingsSuccess(response.data));
      } else {
          store.dispatch(fetchNetworkSettingsError(response.message));
        }
      } catch (error) {
      store.dispatch(fetchNetworkSettingsError(error));
    }
  };
};
