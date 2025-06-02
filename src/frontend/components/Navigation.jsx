import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogOut from "./LogOut";

function Navigation() {
  const { user } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!(user || localStorage.getItem("token")));
  }, [user]);

  const handleLinkClick = () => {
    const navbarCollapseElement = document.getElementById("navbarNav");
    if (navbarCollapseElement) {
      if (navbarCollapseElement.classList.contains("show")) {
        navbarCollapseElement.classList.remove("show");
      }
    }
  };

  return (
    <nav
      className="bg-gradient navbar navbar-expand-lg shadow-lg w-100 sticky-top"
      style={{ minHeight: "100px" }}
    >
      <div
        className="container-fluid py-1 d-flex justify-content-between align-items-center"
        style={{ padding: "9%" }}
      >
        <a className="navbar-brand" href="#">
          <img src="\Logo.png" alt="WW logo" style={{ maxHeight: "55px" }} />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto text-end">
            <li className="nav-item">
              <a className="nav-link" href="#about" onClick={handleLinkClick}>
                About
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#features"
                onClick={handleLinkClick}
              >
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#FAQ" onClick={handleLinkClick}>
                FAQ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
