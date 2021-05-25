import { store } from "../store";
import { getPlatformSettings, setPlatformSettings } from "../../utils/platforms"

export const fetchPlatformSettingsStarted = () => ({
  type: "FETCH_PLATFORM_SETTINGS_START",
});

export const fetchPlatformSettingsSuccess = (settings) => ({
  type: "FETCH_PLATFORM_SETTINGS_SUCCESS",
  payload: settings,
});

export const fetchPlatformSettingsError = (error) => ({
  type: "FETCH_PLATFORM_SETTINGS_ERROR",
  payload: error,
});

export const fetchPlatformSettings = (url) => {
  return async (dispatch) => {
    store.dispatch(fetchPlatformSettingsStarted());
    try {
      let response = await getPlatformSettings(url);
      if(response.status === "complete") {
          store.dispatch(fetchPlatformSettingsSuccess(response.data));
      } else {
          store.dispatch(fetchPlatformSettingsError(response.message));
        }
      } catch (error) {
      store.dispatch(fetchPlatformSettingsError(error));
    }
  };
};

export const submitPlatformSettings = (url, data) => {
  return async (dispatch) => {
    store.dispatch(fetchPlatformSettingsStarted());
    try {
      let response = await setPlatformSettings(url, data);
      if(response.status === "complete") {
          store.dispatch(fetchPlatformSettingsSuccess(response.data));
      } else {
          store.dispatch(fetchPlatformSettingsError(response.message));
        }
      } catch (error) {
      store.dispatch(fetchPlatformSettingsError(error));
    }
  };
};
