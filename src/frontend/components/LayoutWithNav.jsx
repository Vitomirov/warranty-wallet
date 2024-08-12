import React from "react";
import Navigation from "./Navigation";

const LayoutWithNav = ({ children }) => {
    return (
    <>
        <Navigation />
        <main>{children}</main>
    </>
    );
}
export default LayoutWithNav;