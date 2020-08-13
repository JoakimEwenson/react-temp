import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Form, Button, NavLink } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { ReactComponent as Logo } from "../sun-solid.svg";

export default function PageNav() {
  return (
    <Navbar bg="light" variant="light" expand="xl" fluid="true">
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
            <NavLink>Närliggande mätpunkter</NavLink>
          </LinkContainer>
          <LinkContainer to="/platslista">
            <NavLink>Lista alla mätpunkter</NavLink>
          </LinkContainer>
          <LinkContainer to="/om">
            <NavLink>Om tjänsten</NavLink>
          </LinkContainer>
        </Nav>
        <Form inline>
          <Form.Control
            type="text"
            placeholder="Sök plats"
            className="mr-sm-2"
          />
          <Button variant="outline-secondary" disabled={true}>
            Sök
          </Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}
