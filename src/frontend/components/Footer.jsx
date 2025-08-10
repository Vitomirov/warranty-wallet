import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient py-3">
      <div className="d-flex justify-content-center align-items-center w-100">
        <p className="footer-copy mb-2 mb-md-0 text-center">
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
