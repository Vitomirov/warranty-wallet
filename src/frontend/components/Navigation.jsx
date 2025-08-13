import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navigation() {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!(user || localStorage.getItem("token")));
  }, [user]);

  const handleLinkClick = () => {
    const navbarCollapseElement = document.getElementById("navbarNav");
    if (
      navbarCollapseElement &&
      navbarCollapseElement.classList.contains("show")
    ) {
      navbarCollapseElement.classList.remove("show");
    }
  };

  return (
    <nav className="text-black navbar shadow-lg w-100 fixed-top">
      <div className="d-flex justify-content-between align-items-center help container-fluid conent-layout">
        {/* Brand logo is the first flex item */}
        <a className="navbar-brand" href="#">
          <img src="\Logo.png" alt="WW logo" />
        </a>

        {/* This button is only visible on medium and small screens */}
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* This div is the dropdown menu, only visible on medium and small screens */}
        <div className="collapse navbar-collapse d-lg-none" id="navbarNav">
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

        {/* This is the correct way to space the links on large screens */}
        <div className="d-none d-lg-flex">
          <ul className="navbar-nav d-flex flex-row gap-3">
            <li className="nav-item">
              <a className="nav-link" href="#about">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#features">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#FAQ">
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
