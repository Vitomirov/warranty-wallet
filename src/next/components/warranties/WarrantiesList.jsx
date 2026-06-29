"use client";

import Button from "@/components/ui/Button";
import DeleteWarranty from "./DeleteWarranty";

export default function WarrantiesList({
  warranties,
  listRef,
  rowHeight,
  onView,
  onDeleteSuccess,
}) {
  if (warranties.length === 0) {
    return <div className="mb-5 mt-3">No warranties found.</div>;
  }

  return (
    <div
      ref={listRef}
      style={{
        maxHeight: rowHeight ? rowHeight * 3 : undefined,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <ul className="list-group">
        {warranties.map((warranty) => (
          <li
            key={warranty.warrantyId}
            className="border border-dark-item rounded-3 p-3"
          >
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
              <div className="mb-2 mb-sm-0">
                <div className="fw-bold">{warranty.productName}</div>
                <p className="text-muted">
                  Expires: {warranty.warrantyExpireDate}
                </p>
              </div>
              <div className="d-flex justify-content-between flex-row col-12 col-lg-3 col-md-5 mt-2 mt-sm-0">
                <Button
                  variant="tertiary"
                  onClick={() => onView(warranty.warrantyId)}
                >
                  View
                </Button>
                <DeleteWarranty
                  id={warranty.warrantyId}
                  onDeleteSuccess={onDeleteSuccess}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
