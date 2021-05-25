import { combineReducers } from "redux";
import fetchPlatformsReducer from "./platforms/reducer";
import fetchPlatformSettingsReducer from "./platform_settings/reducer";
import fetchNetworkSettingsReducer from "./network_settings/reducer";
import fetchAuthReducer from "./auth/reducer";

const rootReducer = combineReducers({
  platform : fetchPlatformsReducer,
  platform_settings : fetchPlatformSettingsReducer,
  network_settings : fetchNetworkSettingsReducer,
  auth : fetchAuthReducer
});

export default rootReducer;