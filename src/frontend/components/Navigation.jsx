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
      collapseOnSelect
      className="shadow-lg w-100 fixed-top"
    >
      <Container fluid className="content-layout help">
        <Navbar.Brand>
          {isLoggedIn ? (
            <Link to="/dashboard" className="text-decoration-none">
              <h1 className="text-white">Warranty Wallet</h1>
            </Link>
          ) : (
            <a href="#" className="text-decoration-none">
              <h1 className="text-white help">Warranty Wallet</h1>
            </a>
          )}
        </Navbar.Brand>

        {/* Marketing links next to logo (desktop only, when logged out) */}
        {!isLoggedIn && (
          <Nav className="d-none d-lg-flex">
            <Nav.Link href="#about" className="nav-link">
              About
            </Nav.Link>
            <Nav.Link href="#features" className="nav-link">
              Features
            </Nav.Link>
            <Nav.Link href="#faq" className="nav-link">
              FAQ
            </Nav.Link>
          </Nav>
        )}

        {/* Hamburger toggle */}
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpanded((prev) => !prev)}
        />

        <Navbar.Collapse id="responsive-navbar-nav">
          {isLoggedIn ? (
            <Nav
              className="ms-lg-auto text-end"
              onSelect={() => setExpanded(false)}
            >
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
                className="btn ms-lg-3 text-end"
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
              {/* Collapsible marketing links for mobile */}
              <Nav
                className="text-lg-start d-lg-none text-end"
                onSelect={() => setExpanded(false)}
              >
                <Nav.Link href="#about" className="nav-link ">
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
