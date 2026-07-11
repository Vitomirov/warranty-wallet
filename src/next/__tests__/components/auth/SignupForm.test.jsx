import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignupForm from "@/components/auth/SignupForm";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("next/link", () => {
  return function MockLink({ href, children }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("../../../hooks/auth/useSignUp", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../hooks/auth/useLogin", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("SignupForm", () => {
  let mockHandleSignUp;
  let mockHandleCancel;

  beforeEach(() => {
    mockHandleSignUp = jest.fn();
    mockHandleCancel = jest.fn();

    const useSignUp = require("../../../hooks/auth/useSignUp").default;
    useSignUp.mockReturnValue({
      handleSignUp: mockHandleSignUp,
      message: null,
      loading: false,
    });

    const useLogin = require("../../../hooks/auth/useLogin").default;
    useLogin.mockReturnValue({
      handleCancel: mockHandleCancel,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders signup form with all fields and buttons", () => {
    render(<SignupForm />);

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/phone/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("handles input changes and form submit", () => {
    render(<SignupForm />);

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

    fireEvent.submit(screen.getByRole("form"));

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
    const useSignUp = require("../../../hooks/auth/useSignUp").default;
    useSignUp.mockReturnValue({
      handleSignUp: mockHandleSignUp,
      message: "Account created successfully",
      loading: false,
    });

    render(<SignupForm />);
    expect(
      screen.getByText(/account created successfully/i)
    ).toBeInTheDocument();
  });

  test("calls handleCancel when Back button is clicked", () => {
    render(<SignupForm />);
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(mockHandleCancel).toHaveBeenCalled();
  });

  test("links to login page", () => {
    render(<SignupForm />);
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
      "href",
      "/login"
    );
  });
});
