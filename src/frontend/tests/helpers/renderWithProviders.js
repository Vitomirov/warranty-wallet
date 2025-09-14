import React from "react";
import { render } from "@testing-library/react";
import { AuthProvider } from "../../context/auth/AuthProvider";

export const renderWithProviders = (ui, options = {}) =>
  render(<AuthProvider>{ui}</AuthProvider>, options);
