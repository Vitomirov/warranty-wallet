"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setExpanded(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      const isNavigable = event.target.closest(".nav-link, .navbar-toggler");
      if (expanded && !isNavigable) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [expanded]);

  const collapseNavbar = useCallback(() => setExpanded(false), []);

  const scrollToSection = useCallback(
    (id) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setExpanded(false);
      }
    },
    []
  );

  const sectionHref = (id) => (isHome ? `#${id}` : `/#${id}`);

  const handleSectionClick = (id) => {
    if (isHome) {
      scrollToSection(id);
    } else {
      collapseNavbar();
    }
  };

  return (
    <Navbar
      ref={navRef}
      expand="lg"
      expanded={expanded}
      onToggle={() => setExpanded((prev) => !prev)}
      collapseOnSelect
      className="header w-100 fixed-top"
    >
      <Container
        fluid
        className="content-layout d-flex justify-content-between align-items-center"
      >
        <Navbar.Brand
          as={Link}
          href="/"
          onClick={collapseNavbar}
          className="text-decoration-none ms-3 pt-3"
        >
          <h1 className="logo">Warranty Wallet</h1>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto text-end">
            {isHome ? (
              <>
                <Nav.Link onClick={() => handleSectionClick("about")}>
                  About
                </Nav.Link>
                <Nav.Link onClick={() => handleSectionClick("features")}>
                  Features
                </Nav.Link>
                <Nav.Link onClick={() => handleSectionClick("faq")}>FAQ</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} href={sectionHref("about")} onClick={collapseNavbar}>
                  About
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  href={sectionHref("features")}
                  onClick={collapseNavbar}
                >
                  Features
                </Nav.Link>
                <Nav.Link as={Link} href={sectionHref("faq")} onClick={collapseNavbar}>
                  FAQ
                </Nav.Link>
              </>
            )}
            <span className="separator"></span>
            <Nav.Link as={Link} href="/login" onClick={collapseNavbar}>
              Log In
            </Nav.Link>
            <Nav.Link as={Link} href="/signup" onClick={collapseNavbar}>
              Sign Up
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
