"use client";

import Link from "next/link";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import useHeader from "@/hooks/useHeader";
import { useAuth } from "@/context/auth/AuthContext";
import Button from "@/components/ui/Button";

export default function AppHeader() {
  const { expanded, navRef, toggleExpanded, collapseNavbar } = useHeader();
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
        <Navbar.Brand
          as={Link}
          href="/dashboard"
          onClick={collapseNavbar}
          className="text-decoration-none ms-3 pt-3"
        >
          <h1 className="logo">Warranty Wallet</h1>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto text-end"></Nav>
          <Nav className="d-flex align-items-end gap-3 text-end">
            <NavDropdown
              title="Home"
              id="marketing-dropdown"
              className="dropdown-gradient"
            >
              <NavDropdown.Item
                as={Link}
                href="/about"
                onClick={collapseNavbar}
                className="text-end"
              >
                About
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                href="/features"
                onClick={collapseNavbar}
                className="text-end"
              >
                Features
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                href="/faq"
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
                href="/newWarranty"
                onClick={collapseNavbar}
                className="text-end"
              >
                New Warranty
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                href="/dashboard"
                onClick={collapseNavbar}
                className="text-end"
              >
                My Warranties
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                href="/myAccount"
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
                collapseNavbar();
              }}
            >
              Log Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
