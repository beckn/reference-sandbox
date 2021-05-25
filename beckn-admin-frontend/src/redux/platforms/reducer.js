const INITIAL_STATE = {
    platforms: [],
    loading: false,
    error: ""
  };
  
  const fetchPlatformsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "FETCH_PLATFORMS_START":
        return {
          ...state,
          loading: true,
        };
      case "FETCH_PLATFORMS_SUCCESS":
        return {
          ...state,
          loading: false,
          error: "",
          platforms: action.payload,
        };
      case "FETCH_PLATFORMS_ERROR":
        return {
          ...state,
          loading: false,
          platforms: [],
          error: action.payload,
        };
      case "CLEAR_PLATFORMS":
        return INITIAL_STATE;
      default:
        return state;
    }
  };
  
  export default fetchPlatformsReducer;
  