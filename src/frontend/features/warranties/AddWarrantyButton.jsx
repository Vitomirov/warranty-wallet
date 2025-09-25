import React from "react";
import Button from "../../ui/Button";

export default function AddWarrantyButton({ onClick }) {
  return (
    <div className="text-center mt-3">
      <Button variant="success" onClick={onClick}>
        + Add New Warranty
      </Button>
    </div>
  );
}
