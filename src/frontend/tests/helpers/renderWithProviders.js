import React from "react";
import { render } from "@testing-library/react";
import AuthProvider from "../../context/auth/AuthProvider";
import { BrowserRouter } from "react-router-dom";

// Mock axiosInstance da test ne zavisi od backend-a
jest.mock("../../context/api/axiosInstance", () => ({
  interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
}));

const renderWithProviders = (ui, options) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>,
    options
  );
};

export default renderWithProviders;
