import { forwardRef } from "react";

const Button = forwardRef(
  ({ onClick, children, type = "button", variant = "primary", ...rest }, ref) => {
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

export default Button;
