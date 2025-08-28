import React from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteWarranty from "./DeleteWarranty";
import { useAuth } from "../../context/auth/AuthContext";
import Button from "../../ui/Button";
import useWarrantyDetails from "../../hooks/useWarrantyDetails";

const WarrantyDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Sva logika je u hook-u
  const {
    warranty,
    loading,
    error,
    daysLeft,
    isExpired,
    issueDescription,
    handleIssueChange,
    handleOpenPDF,
    handleSendEmail,
    fetchWarranty,
  } = useWarrantyDetails();

  const handleDeleteSuccess = () => {
    navigate("/dashboard");
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (loading || !warranty)
    return <div className="alert alert-info">Loading...</div>;

  return (
    <section
      id="warrantyDetails"
      className="d-flex justify-content-center align-items-center flex-grow-1"
    >
      <div className="content-layout w-100">
        <h1 className="text-center mb-1 montserrat">
          {warranty.productName} - Warranty Details
        </h1>

        <div className="row g-4">
          <div className="col-12">
            <fieldset className="border rounded h-100 p-0">
              <legend className="float-none w-auto px-2">
                Warranty Information
              </legend>
              <div className="px-3">
                <div className="mb-3">
                  <strong>Date of Purchase:</strong> {warranty.dateOfPurchase}
                </div>
                <div className="mb-3">
                  <strong>Warranty Expiry Date:</strong>{" "}
                  {warranty.warrantyExpireDate}
                </div>
                <div className="mb-3">
                  <strong>Days Left Till Expiry:</strong>{" "}
                  {isExpired ? "Warranty has expired" : `${daysLeft} days left`}
                </div>
                <div className="mb-3">
                  <strong>Seller's Email:</strong> {warranty.sellersEmail}
                </div>

                <div className="mb-3">
                  <Button variant="info" onClick={handleOpenPDF}>
                    Open Warranty PDF
                  </Button>
                </div>

                <div className="mb-3">
                  <textarea
                    id="issueDescription"
                    className="form-control"
                    placeholder="Describe your issue here..."
                    value={issueDescription}
                    onChange={handleIssueChange}
                    rows="4"
                    disabled={isExpired}
                  />
                </div>

                <div className="d-flex justify-content-between gap-2">
                  <Button
                    variant="primary"
                    onClick={() => handleSendEmail(user)}
                    disabled={isExpired}
                  >
                    Send Complaint
                  </Button>
                  <DeleteWarranty
                    id={warranty.warrantyId}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </div>
              </div>
              <div className="button-container mt-4 help d-flex justify-content-end">
                <Link to="/dashboard">
                  <Button variant="secondary">Back</Button>
                </Link>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WarrantyDetails;
