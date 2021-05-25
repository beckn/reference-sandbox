import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doLogout } from "../redux/auth/actions";

function AppNavbar(props) {
  const { auth } = useSelector((state) => ({
    auth: state.auth,
  }));

  const isLoggedIn = auth.token === "" ? false : true;

  const dispatch = useDispatch();

  const protected_links = isLoggedIn ? (
    <div className="mr-auto d-inline-flex">
      <Nav.Link href="/platforms">Platforms</Nav.Link>
      <Nav.Link href="/newPlatform">Add new platform</Nav.Link>
      <Nav.Link href="/networkSettings">Network Settings</Nav.Link>
    </div>
  ) : (
    <div></div>
  );

  const handleLogout = async () => {
    dispatch(doLogout());
  };

  const login_button = (
    <Link to="/login" className="btn btn-outline-success my-2 my-sm-0">
      Login
    </Link>
  );

  //const logout_button = (<Button variant="outline-success" onClick={handleLogout} className="my-2 my-sm-0">Logout</Button>);

  const logout_button = (
    <NavDropdown alignRight title="Account" id="basic-nav-dropdown">
      <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
      <NavDropdown.Item href="/changePassword">Change Password</NavDropdown.Item>
    </NavDropdown>
  );

  const button = isLoggedIn ? logout_button : login_button;

  return (
    <div>
      <Navbar bg="light" variant="light">
        <Navbar.Brand href="/">Beckn Sandbox</Navbar.Brand>
        <Nav className="d-flex w-100">
          <div className="d-flex justify-content-between w-100">
            {protected_links}
            <div className="d-flex flex-row-reverse">{button}</div>
          </div>
        </Nav>
      </Navbar>
    </div>
  );
}

export default AppNavbar;
