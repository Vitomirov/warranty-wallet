import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LogOut from "../../../features/auth/LogOut";
import { useAuth } from "../../../context/auth/AuthContext";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../../context/auth/AuthContext");

describe("LogOut Component", () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ logout: mockLogout });
  });

  test("renders as a button and calls logout on click", () => {
    render(<LogOut />);
    const button = screen.getByText(/log out/i);
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockLogout).toHaveBeenCalled();
  });

  test("renders as a link and calls logout on click", () => {
    render(
      <BrowserRouter>
        <LogOut asLink={true} linkTo="/dashboard" className="nav-link" />
      </BrowserRouter>
    );
    const link = screen.getByText(/log out/i);
    expect(link).toBeInTheDocument();

    fireEvent.click(link);
    expect(mockLogout).toHaveBeenCalled();
  });
});
