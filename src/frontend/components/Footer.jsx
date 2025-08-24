import React from "react";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
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
      </div>
    </footer>
  );
};

export default Footer;
