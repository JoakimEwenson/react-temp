import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Form, Button, NavLink } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { ReactComponent as Logo } from "../sun-solid.svg";

export default function PageNav({changeHandler}) {
  return (
    <Navbar bg="light" variant="light" expand="lg" fluid="true">
      <Navbar.Brand>
        <Link to="" className="navbar-brand">
          <Logo style={{ height: 30 + "px", padding: 5 + "px" }} />
          temperatur.nu
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" defaultActiveKey="/">
          <LinkContainer to="/favoriter">
            <NavLink>Favoriter</NavLink>
          </LinkContainer>
          <LinkContainer to="/narliggande">
            <NavLink>Närliggande</NavLink>
          </LinkContainer>
          <LinkContainer to="/platslista">
            <NavLink>Alla mätpunkter</NavLink>
          </LinkContainer>
          <LinkContainer to="/om">
            <NavLink>Om tjänsten</NavLink>
          </LinkContainer>
        </Nav>
        <Form inline>
          <Form.Control
            type="text"
            placeholder="Mätplats"
            onChange={changeHandler}
            className="mr-sm-2"
          />
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}
