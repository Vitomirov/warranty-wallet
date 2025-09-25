import React from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/esm/Navbar";
import Nav from "react-bootstrap/esm/Nav";
import Container from "react-bootstrap/esm/Container";
import NavDropdown from "react-bootstrap/esm/NavDropdown";
import useHeader from "../hooks/useHeader";
import { useAuth } from "../context/auth/AuthContext";
import Button from "../ui/Button";

function Header() {
  const {
    expanded,
    navRef,
    isLoggedIn,
    user,
    toggleExpanded,
    collapseNavbar,
    scrollToSection,
  } = useHeader();
  const { logout } = useAuth();

  return (
    <Navbar
      ref={navRef}
      expand="lg"
      expanded={expanded}
      onToggle={toggleExpanded}
      collapseOnSelect
      className="header w-100 fixed-top"
    >
      <Container
        fluid
        className="content-layout d-flex justify-content-between align-items-center"
      >
        {isLoggedIn ? (
          <Navbar.Brand
            as={Link}
            to="/dashboard"
            onClick={collapseNavbar}
            className="text-decoration-none ms-3 pt-3"
          >
            <h1 className="logo">Warranty Wallet</h1>
          </Navbar.Brand>
        ) : (
          <Navbar.Brand href="#" className="text-decoration-none ms-3 pt-3">
            <h1 className="logo">Warranty Wallet</h1>
          </Navbar.Brand>
        )}

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {!isLoggedIn ? (
            <Nav className="ms-auto text-end">
              <Nav.Link onClick={() => scrollToSection("about")}>
                About
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection("features")}>
                Features
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection("faq")}>FAQ</Nav.Link>
              <span className="separator"></span>
              <Nav.Link as={Link} to="/login" onClick={collapseNavbar}>
                Log In
              </Nav.Link>
              <Nav.Link as={Link} to="/signup" onClick={collapseNavbar}>
                Sign Up
              </Nav.Link>
            </Nav>
          ) : (
            <>
              <Nav className="ms-auto text-end"></Nav>
              <Nav className="d-flex align-items-end gap-3 text-end">
                <NavDropdown
                  title="Home"
                  id="marketing-dropdown"
                  className="dropdown-gradient"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/about"
                    onClick={collapseNavbar}
                    className="text-end"
                  >
                    About
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/features"
                    onClick={collapseNavbar}
                    className="text-end"
                  >
                    Features
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/faq"
                    onClick={collapseNavbar}
                    className="text-end"
                  >
                    FAQ
                  </NavDropdown.Item>
                </NavDropdown>

                <NavDropdown
                  title="User Account"
                  id="user-dropdown"
                  align="end"
                  className="dropdown-gradient"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/newWarranty"
                    onClick={collapseNavbar}
                    className="text-end"
                  >
                    New Warranty
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/dashboard"
                    onClick={collapseNavbar}
                    className="text-end"
                  >
                    My Warranties
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/myAccount"
                    onClick={collapseNavbar}
                    className="text-end"
                  >
                    Account Settings
                  </NavDropdown.Item>
                </NavDropdown>
                <Button
                  type="button"
                  variant="logout"
                  onClick={() => {
                    logout();
                    collapseNavbar(); // Zatvaramo nav bar nakon odjave
                  }}
                >
                  Log Out
                </Button>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
