import { store } from "../store";
import { getAllPlatforms } from "../../utils/platforms"

export const fetchPlatformsStarted = () => ({
  type: "FETCH_PLATFORMS_START",
});

export const fetchPlatformsSuccess = (platforms) => ({
  type: "FETCH_PLATFORMS_SUCCESS",
  payload: platforms,
});

export const fetchPlatformsError = (error) => ({
  type: "FETCH_PLATFORMS_ERROR",
  payload: error,
});

export const fetchPlatforms = () => {
  return async (dispatch) => {
    store.dispatch(fetchPlatformsStarted());
    try {
      let response = await getAllPlatforms();
      if(response.status === "complete") {
          store.dispatch(fetchPlatformsSuccess(response.data));
      } else {
          store.dispatch(fetchPlatformsError(response.message));
        }
      } catch (error) {
      store.dispatch(fetchPlatformsError(error));
    }
  };
};
