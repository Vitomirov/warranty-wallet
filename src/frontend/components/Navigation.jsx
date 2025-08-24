import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function Navigation() {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const navRef = useRef(null);

  /* -----------------------------
   * Close Navbar when scrolling
   * --------------------------- */
  useEffect(() => {
    function handleScroll() {
      setExpanded(false);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* -----------------------------
   * Close Navbar when clicking outside
   * --------------------------- */
  useEffect(() => {
    function handleClick(event) {
      if (!navRef.current) return;
      if (!navRef.current.contains(event.target)) {
        setExpanded(false);
        return;
      }
      if (
        navRef.current.contains(event.target) &&
        !event.target.closest(".nav-link") &&
        !event.target.closest(".navbar-toggler")
      ) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* -----------------------------
   * Handle user logout
   * --------------------------- */
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  /* -----------------------------
   * Scroll function for guests
   * --------------------------- */
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setExpanded(false);
    }
  };

  return (
    <Navbar
      ref={navRef}
      expand="lg"
      expanded={expanded}
      collapseOnSelect
      className="shadow-lg w-100 fixed-top"
    >
      <Container
        fluid
        className="content-layout help d-flex justify-content-between align-items-center"
      >
        {/* Brand / Logo */}
        <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <Link to="/dashboard" className="text-decoration-none me-3">
              <h1 className="text-white">Warranty Wallet</h1>
            </Link>
          ) : (
            <a href="#" className="text-decoration-none me-3">
              <h1 className="text-white help">Warranty Wallet</h1>
            </a>
          )}

          {/* Marketing links for guests or dropdown for logged users */}
          {!isLoggedIn ? (
            <Nav className="d-flex gap-3">
              <Nav.Link onClick={() => scrollToSection("about")}>
                About
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection("features")}>
                Features
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection("faq")}>FAQ</Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <NavDropdown title="Home" id="marketing-dropdown">
                <NavDropdown.Item as={Link} to="/about">
                  About
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/features">
                  Features
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/faq">
                  FAQ
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </div>

        {/* Right side links */}
        <Nav className="ms-auto text-end">
          {isLoggedIn && (
            <NavDropdown title="User Account" id="user-dropdown" align="end">
              <NavDropdown.Item as={Link} to="/newWarranty">
                New Warranty
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/dashboard">
                My Warranties
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/myAccount">
                Account Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                as="button"
                onClick={() => {
                  handleLogout();
                  setExpanded(false);
                }}
              >
                Log Out
              </NavDropdown.Item>
            </NavDropdown>
          )}

          {!isLoggedIn && (
            <div className="help">
              <Nav.Link as={Link} to="/login">
                Log In
              </Nav.Link>
              <Nav.Link as={Link} to="/signup">
                Sign Up
              </Nav.Link>
            </div>
          )}
        </Nav>

        {/* Hamburger Toggle */}
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpanded((prev) => !prev)}
        />
        <Navbar.Collapse id="responsive-navbar-nav"></Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
