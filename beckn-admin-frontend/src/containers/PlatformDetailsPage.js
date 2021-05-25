import React from "react";
import { PlatformDetails, PlatformSettings } from "../components/";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

function PlatformDetailsPage(props) {
  const { platform } = useSelector((state) => ({
    platform: state.platform,
  }));

  const { id } = useParams();
  const history = useHistory();

  const selected = platform.platforms.find((item) => item.id === id);

  if (id === "" || id === undefined || id === null || selected === undefined) {
    history.push(`/platforms`);
    return <div>Redirecting...</div>;
  }
  let AdditionalComponents = [];

  if (selected.is_mock === true) {
    AdditionalComponents.push(
      <div key="PlatformSettings">
        <PlatformSettings platform={selected} />
      </div>
    );
  }

  return (
    <div>
      <PlatformDetails platform={selected} />
      {AdditionalComponents}
    </div>
  );
}

export default PlatformDetailsPage;
