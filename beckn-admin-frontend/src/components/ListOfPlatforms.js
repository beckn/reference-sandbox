import React from "react";
import { Table } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function ListOfPlatforms(props) {
  console.log("PROPS!!",props)
  const history = useHistory();
  const headers = Object.keys(props.platforms[0]);
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            {headers.map((item, i) => (
              <th key={i} className="platformDetailsHeader">
                {item.replace("_", " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.platforms.map((row, i) => (
            <tr
              key={i}
              onClick={() => {
                history.push(`/platform/${row.id}`);
              }}
            >
              {headers.map((item, i) => (
                <td key={i}>{String(row[item])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
