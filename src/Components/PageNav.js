import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavLink } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function PageNav() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fluid="true" className="bg-dark">
      <Navbar.Brand>
        <Link to="/" className="navbar-brand">
        <i className="fas fa-sun mr-2"></i>
          <b>temperatur.nu</b>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" defaultActiveKey="/">
          <LinkContainer to="/favoriter">
            <NavLink><i className="fas fa-star mr-2"></i>Favoriter</NavLink>
          </LinkContainer>
          <LinkContainer to="/narliggande">
            <NavLink><i className="fas fa-location-arrow mr-2"></i>Närliggande</NavLink>
          </LinkContainer>
          <LinkContainer to="/platslista">
            <NavLink><i className="fas fa-bars mr-2"></i>Alla mätpunkter</NavLink>
          </LinkContainer>
          <LinkContainer to="/om">
            <NavLink><i className="fas fa-question-circle mr-2"></i>Om tjänsten</NavLink>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
