import React, { forwardRef } from "react";
import PropTypes from "prop-types";

/**
 * A reusable button component that can be customized with different variants and properties.
 * It follows the "single responsibility principle," focusing only on rendering a button element. */
const Button = forwardRef(
  (
    { onClick, children, type = "button", variant = "primary", ...rest },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        className={`button button--${variant}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

Button.propTypes = {
  /** A function to be called when the button is clicked. */
  onClick: PropTypes.func,
  /** The content of the button, usually text or an icon. */
  children: PropTypes.node.isRequired,
  /** The HTML type of the button. */
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  /** The visual style variant of the button. */
  variant: PropTypes.oneOf(["primary", "secondary", "danger"]),
};

export default Button;
