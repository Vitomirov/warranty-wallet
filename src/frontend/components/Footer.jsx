import React from "react";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user } = useAuth(); // proveravamo da li je user ulogovan

  // Funkcija za smooth scroll do sekcije
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gradient py-4">
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center w-100">
        {/* Copyright */}
        <p className="footer-copy mb-2 mb-md-0 text-center text-white">
          &copy; Designed and Developed by{" "}
          <a
            className="text-decoration-underline text-white"
            href="https://portfolio.devitowarranty.xyz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dejan Vitomirov
          </a>
        </p>

        {/* Linkovi samo ako je user ulogovan */}
        {user && (
          <nav className="ms-md-4 mt-2 mt-md-0 d-flex justify-content-between">
            <button
              className="btn btn-link text-white me-3 p-0"
              onClick={() => handleScroll("about")}
            >
              About
            </button>
            <button
              className="btn btn-link text-white me-3 p-0"
              onClick={() => handleScroll("features")}
            >
              Features
            </button>
            <button
              className="btn btn-link text-white p-0"
              onClick={() => handleScroll("faq")}
            >
              FAQ
            </button>
          </nav>
        )}
      </div>
    </footer>
  );
};

export default Footer;
