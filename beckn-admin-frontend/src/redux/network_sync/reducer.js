const INITIAL_STATE = {
    settings: [],
    loading: false,
    error: ""
  };
  
  const fetchNetworkSettingsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "FETCH_NETWORK_SETTINGS_START":
        return {
          ...state,
          settings: [],
          loading: true,
        };
      case "FETCH_NETWORK_SETTINGS_SUCCESS":
        return {
          ...state,
          loading: false,
          error: "",
          settings: action.payload,
        };
      case "FETCH_NETWORK_SETTINGS_ERROR":
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default fetchNetworkSettingsReducer;
  