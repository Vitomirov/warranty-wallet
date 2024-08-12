import React from "react";

const LayoutWithoutNav = ({ children }) => {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
export default LayoutWithoutNav;