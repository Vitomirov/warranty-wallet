import React from "react";
import Footer from "./Footer";
import Navigation from "./Navigation"; 

function LayoutWithNav({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100"> {/* Flexbox container */}
      <Navigation />
      <main className="flex-grow-1">{children}</main> {/* Main content */}
      <Footer /> {/* Footer */}
    </div>
  );
}

export default LayoutWithNav;
