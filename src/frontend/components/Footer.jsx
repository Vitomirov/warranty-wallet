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
    <footer id="contact"  className="bg-gradient border-bottom border-dark py-2 d-flex justify-content-between align-items-center">
      <p className="mb-0 col-lg-5">
        &copy; Designed and Developed by Dejan Vitomirov
      </p>
      <div className="pe-5">
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
    </footer>
  );
}

export default Footer;