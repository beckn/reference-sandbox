const INITIAL_STATE = {
  token: "",
  username: "",
  loading: false,
  error: "",
};

const fetchAuthReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_AUTH_START":
      return {
        ...state,
        token: "",
        error: "",
        username: action.payload,
        loading: true,
      };
    case "FETCH_AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: "",
        token: action.payload,
      };
    case "FETCH_AUTH_ERROR":
      return {
        ...state,
        loading: false,
        token: "",
        username: "",
        error: action.payload,
      };
    case "CLEAR_AUTH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default fetchAuthReducer;
