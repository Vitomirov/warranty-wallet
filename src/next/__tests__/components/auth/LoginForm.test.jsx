import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "@/components/auth/LoginForm";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("next/link", () => {
  return function MockLink({ href, children }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("../../../hooks/auth/useLogin", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("LoginForm", () => {
  let mockHandleUsernameChange;
  let mockHandlePasswordChange;
  let mockHandleSubmit;
  let mockHandleCancel;

  beforeEach(() => {
    mockHandleUsernameChange = jest.fn();
    mockHandlePasswordChange = jest.fn();
    mockHandleSubmit = jest.fn((e) => e.preventDefault());
    mockHandleCancel = jest.fn();

    const useLogin = require("../../../hooks/auth/useLogin").default;
    useLogin.mockReturnValue({
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
    render(<LoginForm />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  test("handles input changes and form submit", () => {
    render(<LoginForm />);

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
    const useLogin = require("../../../hooks/auth/useLogin").default;
    useLogin.mockReturnValue({
      username: "",
      password: "",
      error: "Invalid credentials",
      loading: false,
      handleUsernameChange: jest.fn(),
      handlePasswordChange: jest.fn(),
      handleSubmit: jest.fn(),
      handleCancel: jest.fn(),
    });

    render(<LoginForm />);
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test("calls handleCancel when Back button is clicked", () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(mockHandleCancel).toHaveBeenCalled();
  });

  test("links to signup page", () => {
    render(<LoginForm />);
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/signup"
    );
  });
});
