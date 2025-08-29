import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/auth/AuthContext";

/**
 * Custom hook to manage responsive header state and behavior.
 * Encapsulates logic for navbar toggling and side effects.
 */
const useHeader = () => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef(null);
  const isLoggedIn = !!user;

  /** Closes the navbar menu when the user scrolls the window.*/
  useEffect(() => {
    const handleScroll = () => setExpanded(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Collapses the navbar on click events outside of navigation elements.
   * This ensures a clean close behavior for both desktop and mobile views.
   */
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

  /* Scrolls to an element by its ID and collapses the navbar.*/
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setExpanded(false); // Collapse the menu after clicking a link
    }
  };

  /* Toggles the expanded state of the navbar.*/
  const toggleExpanded = () => setExpanded((prev) => !prev);

  /* Collapses the navbar.*/
  const collapseNavbar = () => setExpanded(false);

  return {
    expanded,
    navRef,
    isLoggedIn,
    user,
    toggleExpanded,
    collapseNavbar,
    scrollToSection,
  };
};

export default useHeader;
