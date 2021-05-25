import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

function SecuredRoute(props) {
  const { auth } = useSelector((state) => ({
    auth: state.auth,
  }));

  return (
    <Route
      path={props.path}
      render={(data) =>
        auth.token !== "" ? (
          <props.component {...data} />
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        )
      }
    >
    </Route>
  );
}

export default SecuredRoute;
