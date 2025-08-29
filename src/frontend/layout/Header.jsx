import { Link } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import LogOut from "../features/auth/LogOut";
import useHeader from "../hooks/useHeader";

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

  return (
    // The main navigation container. `ref` is used to track clicks outside the element.

    <Navbar
      ref={navRef}
      expand="lg"
      expanded={expanded}
      onToggle={toggleExpanded}
      collapseOnSelect
      className="shadow-lg w-100 fixed-top"
    >
      <Container
        fluid
        className="content-layout help d-flex justify-content-between align-items-center"
      >
        {/* Logo and brand name. Navigates to the dashboard if the user is logged in. */}

        {isLoggedIn ? (
          <Navbar.Brand
            as={Link}
            to="/dashboard"
            onClick={collapseNavbar}
            className="text-decoration-none"
          >
            <h1 className="text-white">Warranty Wallet</h1>
          </Navbar.Brand>
        ) : (
          <Navbar.Brand href="#" className="text-decoration-none">
            <h1 className="text-white">Warranty Wallet</h1>
          </Navbar.Brand>
        )}

        {/* Hamburger toggle button for collapsing the navigation on mobile. */}

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        {/* The collapsible part of the navigation menu. */}

        <Navbar.Collapse id="responsive-navbar-nav">
          {!isLoggedIn ? (
            <>
              {/* Navigation links for marketing pages when the user is not logged in. */}
              <Nav className="text-end">
                <Nav.Link onClick={() => scrollToSection("about")}>
                  About
                </Nav.Link>
                <Nav.Link onClick={() => scrollToSection("features")}>
                  Features
                </Nav.Link>
                <Nav.Link onClick={() => scrollToSection("faq")}>FAQ</Nav.Link>
              </Nav>
              <NavDropdown.Divider />
              {/* Authentication links (Log In / Sign Up). */}
              <Nav className="ms-auto text-end">
                <Nav.Link as={Link} to="/login" onClick={collapseNavbar}>
                  Log In
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" onClick={collapseNavbar}>
                  Sign Up
                </Nav.Link>
              </Nav>
            </>
          ) : (
            <>
              {/* Navigation links and dropdowns for logged-in users. */}
              <Nav className="ms-auto"></Nav>
              <Nav className="d-flex align-items-end gap-3 text-end">
                <NavDropdown title="Home" id="marketing-dropdown">
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
                  <NavDropdown.Divider />
                  <NavDropdown.Item className="nav-link btn">
                    <LogOut />
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
