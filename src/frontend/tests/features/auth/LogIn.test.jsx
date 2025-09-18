import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LogIn from "../../../features/auth/LogIn";
import renderWithProviders from "../../helpers/renderWithProviders";
import { BrowserRouter } from "react-router-dom";

// Mock-ovanje useNavigate i useLogin
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../hooks/useLogin", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("LogIn Component", () => {
  let mockHandleUsernameChange;
  let mockHandlePasswordChange;
  let mockHandleSubmit;
  let mockHandleCancel;

  beforeEach(() => {
    mockHandleUsernameChange = jest.fn();
    mockHandlePasswordChange = jest.fn();
    mockHandleSubmit = jest.fn((e) => e.preventDefault());
    mockHandleCancel = jest.fn();

    const { default: useLoginMock } = require("../../../hooks/useLogin");
    useLoginMock.mockReturnValue({
      username: "",
      password: "",
      error: null,
      loading: false,
      handleUsernameChange: mockHandleUsernameChange,
      handlePasswordChange: mockHandlePasswordChange,
      handleSubmit: mockHandleSubmit,
      handleCancel: mockHandleCancel,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form with all elements", () => {
    render(<LogIn />, { wrapper: BrowserRouter });

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign Up/i })
    ).toBeInTheDocument();
  });

  test("handles input changes and form submit", async () => {
    render(<LogIn />, { wrapper: BrowserRouter });

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen.getByRole("form");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(form);

    expect(mockHandleUsernameChange).toHaveBeenCalled();
    expect(mockHandlePasswordChange).toHaveBeenCalled();
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  test("renders error message if error exists", () => {
    const { default: useLoginMock } = require("../../../hooks/useLogin");
    useLoginMock.mockReturnValue({
      username: "",
      password: "",
      error: "Invalid credentials",
      loading: false,
      handleUsernameChange: jest.fn(),
      handlePasswordChange: jest.fn(),
      handleSubmit: jest.fn(),
      handleCancel: jest.fn(),
    });

    render(<LogIn />, { wrapper: BrowserRouter });
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test("calls handleCancel when Back button is clicked", () => {
    render(<LogIn />, { wrapper: BrowserRouter });
    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);
    expect(mockHandleCancel).toHaveBeenCalled();
  });

  test("navigates to signup on button click", () => {
    render(<LogIn />, { wrapper: BrowserRouter });
    const signUpButton = screen.getByRole("button", { name: /Sign Up/i });
    fireEvent.click(signUpButton);
    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });
});
