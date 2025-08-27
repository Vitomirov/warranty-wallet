import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useAuth } from "../context/auth/AuthContext";
import LogOut from "../features/auth/LogOut";

function Navigation() {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const navRef = useRef(null);

  useEffect(() => {
    function handleScroll() {
      setExpanded(false);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        {/* Logo */}
        {isLoggedIn ? (
          <Navbar.Brand
            as={Link}
            to="/dashboard"
            className="text-decoration-none"
          >
            <h1 className="text-white">Warranty Wallet</h1>
          </Navbar.Brand>
        ) : (
          <Navbar.Brand href="#" className="text-decoration-none">
            <h1 className="text-white">Warranty Wallet</h1>
          </Navbar.Brand>
        )}

        {/* Hamburger Toggle */}
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpanded((prev) => !prev)}
        />

        {/* Navigacija se prebacuje u Navbar.Collapse */}
        <Navbar.Collapse id="responsive-navbar-nav">
          {/* Linkovi za nelogovane korisnike */}
          {!isLoggedIn ? (
            <>
              {/* Leva strana: Marketing linkovi */}
              <Nav className="me-auto">
                <Nav.Link onClick={() => scrollToSection("about")}>
                  About
                </Nav.Link>
                <Nav.Link onClick={() => scrollToSection("features")}>
                  Features
                </Nav.Link>
                <Nav.Link onClick={() => scrollToSection("faq")}>FAQ</Nav.Link>
              </Nav>

              {/* Desna strana: Log In / Sign Up */}
              <Nav>
                <Nav.Link as={Link} to="/login">
                  Log In
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Sign Up
                </Nav.Link>
              </Nav>
            </>
          ) : (
            <>
              {/* Leva strana (prazna za logovane) */}
              <Nav className="me-auto"></Nav>

              {/* Desna strana: Dropdown meniji za logovane korisnike */}
              <Nav className="d-flex align-items-center gap-3">
                <NavDropdown title="Home" id="marketing-dropdown" align="end">
                  <NavDropdown.Item
                    as={Link}
                    to="/about"
                    onClick={() => setExpanded(false)}
                  >
                    About
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/features"
                    onClick={() => setExpanded(false)}
                  >
                    Features
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/faq"
                    onClick={() => setExpanded(false)}
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
                    onClick={() => setExpanded(false)}
                  >
                    New Warranty
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/dashboard"
                    onClick={() => setExpanded(false)}
                  >
                    My Warranties
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/myAccount"
                    onClick={() => setExpanded(false)}
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

export default Navigation;
