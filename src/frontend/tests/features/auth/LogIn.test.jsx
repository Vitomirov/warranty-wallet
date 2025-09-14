import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LogIn from "../../../features/auth/LogIn";

// Mock hook
jest.mock("../../../hooks/useLogin");

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

  test("renders login form with all elements", () => {
    render(<LogIn />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  test("handles input changes and form submit", () => {
    render(<LogIn />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen.getByRole("form"); // form treba da ima role="form"

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.submit(form); // ovo aktivira handleSubmit

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
      handleUsernameChange: mockHandleUsernameChange,
      handlePasswordChange: mockHandlePasswordChange,
      handleSubmit: mockHandleSubmit,
      handleCancel: mockHandleCancel,
    });

    render(<LogIn />);
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test("calls handleCancel when Back button is clicked", () => {
    render(<LogIn />);
    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);
    expect(mockHandleCancel).toHaveBeenCalled();
  });
});
