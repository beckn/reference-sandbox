import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { PlatformDetailsForm } from "../components";

function EditPlatformDetailsPage(props) {
  const { platform } = useSelector((state) => ({
    platform: state.platform,
  }));

  let { id } = useParams();
  const history = useHistory();

  const selected = platform.platforms.find((item) => item.id === id);

  if (id === "" || id === undefined || id === null || selected === undefined) {
    history.push(`/platforms`);
    return <div>Redirecting...</div>;
  }

  return (
    <div>
      <PlatformDetailsForm record={selected} />
    </div>
  );
}

export default EditPlatformDetailsPage;
