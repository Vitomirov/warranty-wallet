import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignUp from "../../../features/auth/SignUp";
import { BrowserRouter } from "react-router-dom";

// Mock-ovanje useNavigate i useSignUp
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../hooks/useSignUp", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../../../hooks/useLogin", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("SignUp Component", () => {
  let mockHandleSignUp;
  let mockHandleCancel;

  beforeEach(() => {
    mockHandleSignUp = jest.fn();
    mockHandleCancel = jest.fn();

    const { default: useSignUpMock } = require("../../../hooks/useSignUp");
    useSignUpMock.mockReturnValue({
      handleSignUp: mockHandleSignUp,
      message: null,
      loading: false,
    });

    const { default: useLoginMock } = require("../../../hooks/useLogin");
    useLoginMock.mockReturnValue({
      handleCancel: mockHandleCancel,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders signup form with all fields and buttons", () => {
    render(<SignUp />, { wrapper: BrowserRouter });
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/phone/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("handles input changes and form submit", () => {
    render(<SignUp />, { wrapper: BrowserRouter });

    const form = screen.getByRole("form");

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/address/i), {
      target: { value: "123 Street" },
    });
    fireEvent.change(screen.getByPlaceholderText(/phone/i), {
      target: { value: "1234567890" },
    });

    fireEvent.submit(form);

    expect(mockHandleSignUp).toHaveBeenCalledWith({
      username: "testuser",
      userEmail: "test@example.com",
      password: "password123",
      fullName: "Test User",
      userAddress: "123 Street",
      userPhoneNumber: "1234567890",
    });
  });

  test("renders message if message exists", () => {
    const { default: useSignUpMock } = require("../../../hooks/useSignUp");
    useSignUpMock.mockReturnValue({
      handleSignUp: mockHandleSignUp,
      message: "Account created successfully",
      loading: false,
    });

    render(<SignUp />, { wrapper: BrowserRouter });
    expect(
      screen.getByText(/account created successfully/i)
    ).toBeInTheDocument();
  });

  test("calls handleCancel when Back button is clicked", () => {
    render(<SignUp />, { wrapper: BrowserRouter });
    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);
    expect(mockHandleCancel).toHaveBeenCalled();
  });

  test("navigates to login on button click", () => {
    render(<SignUp />, { wrapper: BrowserRouter });
    const loginButton = screen.getByRole("button", { name: /Log In/i });
    fireEvent.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
