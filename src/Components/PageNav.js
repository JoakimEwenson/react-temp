import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavLink } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { ReactComponent as Logo } from "../sun-solid.svg";

export default function PageNav() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fluid="true" className="bg-dark">
      <Navbar.Brand>
        <Link to="" className="navbar-brand">
        <i class="fas fa-sun mx-1"></i>
          <b>temperatur.nu</b>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" defaultActiveKey="/">
          <LinkContainer to="/favoriter">
            <NavLink><i className="fas fa-star mx-1"></i>Favoriter</NavLink>
          </LinkContainer>
          <LinkContainer to="/narliggande">
            <NavLink><i class="fas fa-location-arrow mx-1"></i>Närliggande</NavLink>
          </LinkContainer>
          <LinkContainer to="/platslista">
            <NavLink><i class="fas fa-bars mx-1"></i>Alla mätpunkter</NavLink>
          </LinkContainer>
          <LinkContainer to="/om">
            <NavLink><i class="fas fa-question-circle mx-1"></i>Om tjänsten</NavLink>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
