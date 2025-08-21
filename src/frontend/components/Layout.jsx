import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
/** * Layout is a single component that wraps the entire application. * It provides a consistent structure with a smart Navigation bar and a Footer. * This simplifies routing and ensures every page has the correct overall layout. * * @param {object} props The props object. * @param {React.ReactNode} props.children The child components to be rendered within the layout. */ const Layout =
  ({ children }) => {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navigation />
        <main className="flex-grow-1 d-flex content-layout help justify-content-center align-items-center">
          {children}
        </main>
        <Footer />
      </div>
    );
  };
export default Layout;
