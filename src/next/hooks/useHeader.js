"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Manages responsive app header navbar state and behavior.
 */
export default function useHeader() {
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

  const toggleExpanded = () => setExpanded((prev) => !prev);
  const collapseNavbar = () => setExpanded(false);

  return {
    expanded,
    navRef,
    toggleExpanded,
    collapseNavbar,
  };
}
