import React from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteWarranty from "./DeleteWarranty";
import { useAuth } from "../../context/auth/AuthContext";
import Button from "../../ui/Button";
import useWarrantyDetails from "../../hooks/useWarrantyDetails";

const WarrantyDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
  } = useWarrantyDetails();

  const handleDeleteSuccess = () => {
    navigate("/dashboard");
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (loading || !warranty)
    return <div className="alert alert-info">Loading...</div>;

  return (
    <div className="container col-12 col-md-10 col-lg-8 mt-5">
      <h1 className="text-center mb-4">
        {warranty.productName} - Warranty Details
      </h1>

      <div className="row">
        <fieldset className="h-100">
          <div className="mb-3">
            <strong>Date of Purchase:</strong> {warranty.dateOfPurchase}
          </div>
          <div className="mb-3">
            <strong>Expiry Date:</strong> {warranty.warrantyExpireDate}
          </div>
          <div className="mb-3">
            <strong>Expires In:</strong>{" "}
            {isExpired ? "Warranty has expired" : `${daysLeft} days left`}
          </div>
          <div className="mb-3">
            <strong>Seller's Email:</strong> {warranty.sellersEmail}
          </div>

          <div className="mb-3">
            <Button variant="primary" onClick={handleOpenPDF}>
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
              Send
            </Button>
            <DeleteWarranty
              id={warranty.warrantyId}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </div>
          <div className="mt-4 d-flex justify-content-end">
            <Link to="/dashboard">
              <Button variant="secondary">Back</Button>
            </Link>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default WarrantyDetails;
