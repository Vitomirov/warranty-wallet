import React from "react";
import Footer from "./Footer"; // Ensure the path is correct

function LayoutWithoutNav({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100"> {/* Flexbox container */}
      <main className="flex-grow-1">{children}</main> {/* Main content */}
      <Footer /> {/* Footer */}
    </div>
  );
}

export default LayoutWithoutNav;
