import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlatforms } from "../redux/platforms/actions";
import ListOfPlatforms from "../components/ListOfPlatforms";

function RegisteredPlatformsList(props) {
  const { platform } = useSelector((state) => ({
    platform: state.platform,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPlatforms());
  }, [dispatch]);

  const removePlatformType = (platform_array) => {
    const platforms = []; 
    for(let p of platform_array) {
      const data = { ...p };
      delete data.platform_type;
      platforms.push(data)
    }
    return platforms
  }

  let BAPs = [];
  let BPPs = [];
  if (platform.loading === false && platform.error === "") {
    BAPs = platform.platforms.filter((p) => p.platform_type === "BAP");
    BPPs = platform.platforms.filter((p) => p.platform_type === "BPP");
  }

  if (
    platform.loading === false &&
    platform.error === "" &&
    platform.platforms.length !== 0
  ) {
    const BAPcomponent =
      BAPs.length !== 0 ? (
        <ListOfPlatforms platforms={removePlatformType(BAPs)} />
      ) : (
        <div>No data...</div>
      );
    const BPPcomponent =
      BPPs.length !== 0 ? (
        <ListOfPlatforms platforms={removePlatformType(BPPs)} />
      ) : (
        <div>No data...</div>
      );
    return (
      <div>
        <h1> List of BAPs </h1>
        {BAPcomponent}
        <h1> List of BPPs </h1>
        {BPPcomponent}
      </div>
    );
  } else if (platform.platforms.length === 0) {
    return <div>No data...</div>;
  } else if (platform.error !== "") {
    return <div>{platform.error}</div>;
  } else {
    return <div>Loading...</div>;
  }
}

export default RegisteredPlatformsList;
