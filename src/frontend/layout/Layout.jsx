import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";

/* Layout wraps the whole app with Navigation on top and Footer at bottom */

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <main className="flex-grow-1 d-flex content-layout justify-content-center align-items-center align-items-start pt-5">
        <div className="container">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
