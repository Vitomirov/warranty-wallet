import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function Navigation() {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const navRef = useRef(null);

  // close on scroll
  useEffect(() => {
    function handleScroll() {
      setExpanded(false);
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // close on click outside or on empty space inside navbar
  useEffect(() => {
    function handleClick(event) {
      if (!navRef.current) return;

      // close on click outside the navbar
      if (!navRef.current.contains(event.target)) {
        setExpanded(false);
        return;
      }

      // close on click in navbar, but not on link
      if (
        navRef.current.contains(event.target) &&
        !event.target.closest(".nav-link")
      ) {
        setExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <Navbar
      ref={navRef}
      expand="lg"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      collapseOnSelect
      className="shadow-lg w-100 fixed-top"
    >
      <Container fluid className="content-layout help">
        <Navbar.Brand href="#">
          <h1 className="text-white">Warranty Wallet</h1>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {isLoggedIn ? (
            <Nav className="ms-lg-auto" onSelect={() => setExpanded(false)}>
              <Nav.Link
                as={Link}
                to="/myWarranties"
                onClick={() => setExpanded(false)}
              >
                My Warranties
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/newWarranty"
                onClick={() => setExpanded(false)}
              >
                New Warranty
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/myAccount"
                onClick={() => setExpanded(false)}
              >
                My Account
              </Nav.Link>
              <Nav.Link
                as="button"
                className="btn ms-lg-3"
                onClick={() => {
                  handleLogout();
                  setExpanded(false);
                }}
              >
                Log Out
              </Nav.Link>
            </Nav>
          ) : (
            <>
              <Nav
                className="ms-auto text-start text-lg-center help"
                onSelect={() => setExpanded(false)}
              >
                <Nav.Link href="#about" className="nav-link help">
                  About
                </Nav.Link>
                <Nav.Link href="#features" className="nav-link">
                  Features
                </Nav.Link>
                <Nav.Link href="#faq" className="nav-link">
                  FAQ
                </Nav.Link>
              </Nav>

              <Nav
                className="ms-0 ms-lg-auto text-end text-lg-end"
                onSelect={() => setExpanded(false)}
              >
                <Nav.Link as={Link} to="/login">
                  Log In
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Sign Up
                </Nav.Link>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
