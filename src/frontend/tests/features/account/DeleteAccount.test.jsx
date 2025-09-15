import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import DeleteAccount from "../../../features/account/DeleteAccount";
import renderWithProviders from "../../helpers/renderWithProviders";

// Mock useDeleteAccount hook
const mockOpen = jest.fn();
const mockClose = jest.fn();
const mockDelete = jest.fn();

jest.mock("../../../hooks/useDeleteAccount", () => ({
  __esModule: true,
  default: () => ({
    showDeleteModal: true,
    error: null,
    openDeleteModal: mockOpen,
    closeDeleteModal: mockClose,
    handleDeleteAccount: mockDelete,
  }),
}));

// Mock alert da ne pravi popup
global.alert = jest.fn();

describe("DeleteAccount component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Delete button and opens modal", () => {
    const { getByText } = renderWithProviders(<DeleteAccount />);

    // Delete button je vidljiv
    const deleteButton = getByText("Delete");
    expect(deleteButton).toBeInTheDocument();

    // Simuliramo klik na Delete button
    fireEvent.click(deleteButton);
    expect(mockOpen).toHaveBeenCalled();
  });

  test("calls handleDeleteAccount on confirmation", async () => {
    const { getByText } = renderWithProviders(<DeleteAccount />);

    // Modal je otvoren (showDeleteModal = true u mock-u)
    const confirmButton = getByText("Yes, delete my account");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
    });
  });

  test("calls closeDeleteModal on cancel", async () => {
    const { getByText } = renderWithProviders(<DeleteAccount />);

    const cancelButton = getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockClose).toHaveBeenCalled();
    });
  });
});
