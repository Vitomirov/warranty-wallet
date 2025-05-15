import React from "react";

function Footer() {
  const handleMailClick = () => {
    window.open("mailto:dejan.vitomirov@gmail.com", "_target");
  };
  const handleGitHubClick = () => {
    window.open("https://github.com/Vitomirov", "_target");
  };
  const handleLinkedinClick = () => {
    window.open("https://www.linkedin.com/in/dejan-vitomirov/", "_target");
  };

  return (
        <footer className="bg-gradient border-top border-dark py-3">
      <div className="container-fluid">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
          <p className="mb-2 mb-md-0">
            &copy; Designed and Developed by Dejan Vitomirov
          </p>
          <div className="me-lg-5">
            <span
              onClick={handleLinkedinClick}
              style={{ cursor: "pointer", margin: "0 10px" }}
            >
              <i className="bi bi-linkedin" style={{ fontSize: "1.5rem" }}></i>
            </span>
            <span
              onClick={handleGitHubClick}
              style={{ cursor: "pointer", margin: "0 10px" }}
            >
              <i className="bi bi-github" style={{ fontSize: "1.5rem" }}></i>
            </span>
            <span
              onClick={handleMailClick}
              style={{ cursor: "pointer", margin: "0 10px" }}
            >
              <i className="bi bi-envelope" style={{ fontSize: "1.5rem" }}></i>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
