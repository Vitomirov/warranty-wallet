import React from "react";
import {
  fireEvent,
  render,
  waitFor,
  screen,
  within,
} from "@testing-library/react";
import DeleteAccount from "../../../features/account/DeleteAccount";
import { BrowserRouter } from "react-router-dom";

// Mock useDeleteAccount hook
jest.mock("../../../hooks/useDeleteAccount");

// Mock alert
global.alert = jest.fn();

describe("DeleteAccount component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Delete button and opens modal", () => {
    // Mockujemo da je modal inicijalno zatvoren
    const {
      default: useDeleteAccountMock,
    } = require("../../../hooks/useDeleteAccount");
    const mockOpen = jest.fn();
    useDeleteAccountMock.mockReturnValue({
      showDeleteModal: false,
      error: null,
      openDeleteModal: mockOpen,
      closeDeleteModal: jest.fn(),
      handleDeleteAccount: jest.fn(),
    });

    render(<DeleteAccount />, { wrapper: BrowserRouter });

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);
    expect(mockOpen).toHaveBeenCalled();
  });

  test("displays the modal and handles confirmation", async () => {
    const mockHandleDelete = jest.fn();
    const mockCloseModal = jest.fn();

    // Mockujemo da je modal otvoren pre nego što se test renderuje
    const {
      default: useDeleteAccountMock,
    } = require("../../../hooks/useDeleteAccount");
    useDeleteAccountMock.mockReturnValue({
      showDeleteModal: true,
      error: null,
      openDeleteModal: jest.fn(),
      closeDeleteModal: mockCloseModal,
      handleDeleteAccount: mockHandleDelete,
    });

    render(<DeleteAccount />, { wrapper: BrowserRouter });

    // Tražimo modal po njegovom ARIA labelu
    const modal = screen.getByRole("dialog", {
      name: /Delete Account Confirmation/i,
    });

    // Koristimo 'within' za pretragu unutar modala
    const modalConfirmButton = within(modal).getByRole("button", {
      name: "Delete",
    });
    const modalCancelButton = within(modal).getByRole("button", {
      name: "Cancel",
    });

    expect(modalConfirmButton).toBeInTheDocument();
    expect(modalCancelButton).toBeInTheDocument();

    fireEvent.click(modalConfirmButton);
    await waitFor(() => {
      expect(mockHandleDelete).toHaveBeenCalled();
    });

    fireEvent.click(modalCancelButton);
    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  test("renders error message if error exists", () => {
    const mockError = "Failed to delete account";
    const {
      default: useDeleteAccountMock,
    } = require("../../../hooks/useDeleteAccount");
    useDeleteAccountMock.mockReturnValue({
      showDeleteModal: true,
      error: mockError,
      openDeleteModal: jest.fn(),
      closeDeleteModal: jest.fn(),
      handleDeleteAccount: jest.fn(),
    });

    render(<DeleteAccount />, { wrapper: BrowserRouter });

    expect(screen.getByText(mockError)).toBeInTheDocument();
  });
});
