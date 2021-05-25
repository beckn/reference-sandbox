import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { deletePlatform } from "../utils/platforms";

function PlatformDetails(props) {
  const history = useHistory();
  const selected = props.platform;

  const handleDelete = async () => {
    if (window.confirm("Delete platform?")) {
      const result = await deletePlatform(selected.id);
      console.log(result)
      history.push(`/platforms`);
    }
  };

  const items = [];

  for (var key in selected) {
    if (selected.hasOwnProperty(key)) {
      items.push(
        <div className="row" key={key}>
          <div className="col platformDetailsHeader">
            {key.replace("_", " ")}
          </div>
          <div className="col">{String(selected[key])} </div>
        </div>
      );
    }
  }

  return (
    <Card className="PlatformCard">
      <Card.Header className="d-flex justify-content-between">
        <div>{selected.platform_type} Details</div>
        <div>
          <Link to={`/editPlatform/${selected.id}`}>EDIT</Link>
          {" | "}
          {//eslint-disable-next-line
          }<a href="#" onClick={handleDelete}>DELETE</a>
        </div>
      </Card.Header>
      <div className="container">{items}</div>
    </Card>
  );
}

export default PlatformDetails;
