// components/About.jsx
import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div id="about" className="container my-5 container-fluid d-flex justify-content-between"> 
      <header className="text-left mb-4">
        <h1 className="display-4">About</h1>
      </header>
      <p className="lead text-justify">
        Warranty Wallet is your ultimate tool for managing warranties with ease.
        We understand how frustrating it can be to keep track of receipts, expiration dates,
        and warranty details. That’s why we designed an app that simplifies the process,
        ensuring your valuable products are always protected.

        With Warranty Wallet, you can securely store, organize,
        and access all your warranties in one place. Whether it’s a household appliance,
        an electronic gadget, or even your car, Warranty Wallet helps you stay informed
        about warranty terms and expiration dates so you never miss out on a claim.
      </p>
    </div>
  );
}

export default About;