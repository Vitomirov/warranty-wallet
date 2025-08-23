// React and library imports
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DeleteWarranty from "./DeleteWarranty";
import { useAuth } from "../context/AuthContext";
import useSecureRequest from "../hooks/useSecureRequest";
import axios from "axios";

const WarrantyDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const { secureRequest } = useSecureRequest();

  const [warranty, setWarranty] = useState(null);
  const [error, setError] = useState(null);
  const [issueDescription, setIssueDescription] = useState("");
  const [daysLeft, setDaysLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  const isMounted = useRef(true);
  const cancelTokenSource = useRef(axios.CancelToken.source());
  const isFetchingRef = useRef(false);

  const fetchWarranty = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await secureRequest(
        "get",
        `/warranties/details/${id}`,
        {},
        { cancelToken: cancelTokenSource.current.token }
      );
      if (isMounted.current) {
        setWarranty(response.data);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch warranty details."
        );
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        isFetchingRef.current = false;
      }
    }
  }, [id, secureRequest]);

  const handleOpenPDF = useCallback(async () => {
    if (!warranty?.warrantyId) return;
    setError(null);
    try {
      const response = await secureRequest(
        "get",
        `/warranties/pdf/${warranty.warrantyId}`,
        {},
        {
          responseType: "blob",
          cancelToken: cancelTokenSource.current.token,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, "_blank");
    } catch (error) {
      if (!axios.isCancel(error)) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Error fetching warranty PDF."
        );
      }
    }
  }, [warranty?.warrantyId, secureRequest]);

  const handleSendEmail = useCallback(async () => {
    if (!warranty || !user) {
      setError("Cannot send email: Warranty or user details not available");
      return;
    }
    setError(null);
    try {
      await secureRequest("post", `/warranty/claim`, {
        userId: user.id,
        productName: warranty.productName,
        warrantyId: warranty.warrantyId,
        username: user.username,
        fullName: user.fullName,
        userAddress: user.userAddress,
        sellersEmail: warranty.sellersEmail,
        userPhoneNumber: user.userPhoneNumber,
        issueDescription,
      });
      alert("Email sent successfully!");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Error sending email. Please try again."
      );
    }
  }, [user, warranty, issueDescription, secureRequest]);

  const calculateDaysLeft = useCallback((expiryDate) => {
    if (!expiryDate || typeof expiryDate !== "string")
      return { days: 0, isExpired: true };
    const dateParts = expiryDate.split("-");
    if (dateParts.length !== 3) return { days: 0, isExpired: true };
    const [day, month, year] = dateParts.map(Number);
    const expiry = new Date(year, month - 1, day);
    const currentDate = new Date();
    const timeLeft = expiry - currentDate;
    const isExpiredResult = timeLeft <= 0;
    return {
      days: isExpiredResult ? 0 : Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
      isExpired: isExpiredResult,
    };
  }, []);

  useEffect(() => {
    if (warranty) {
      const { days, isExpired: expired } = calculateDaysLeft(
        warranty.warrantyExpireDate
      );
      setDaysLeft(days);
      setIsExpired(expired);
    }
  }, [warranty, calculateDaysLeft]);

  useEffect(() => {
    if (id) {
      fetchWarranty();
    } else {
      setError("ID is missing");
      setLoading(false);
    }

    return () => {
      isMounted.current = false;
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel("Operation canceled.");
      }
    };
  }, [id, fetchWarranty]);

  const handleDeleteSuccess = () => {
    navigate("/dashboard");
  };

  const imageSrc = isExpired
    ? "/ExpiredWarranty.png"
    : "/NotExpiredWarranty.png";

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!warranty && loading)
    return <div className="alert alert-info">Loading...</div>;
  if (!warranty && !loading)
    return <div className="alert alert-info">Warranty details not found.</div>;

  return (
    // The main section to center content vertically on the screen.
    <section
      id="warrantyDetails"
      className="d-flex justify-content-center align-items-center flex-grow-1"
    >
      {/* This container defines the central content area, similar to the My Account layout. */}
      <div className="content-layout w-100">
        <h1 className="text-center mb-1 montserrat">
          {warranty.productName} - Warranty Details
        </h1>

        {/* The main details section now spans the full width of the content-layout div. */}
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

                {/* The button to open the warranty PDF, styled to match the layout. */}
                <div className="mb-3">
                  <button className="btn btn-info" onClick={handleOpenPDF}>
                    Open Warranty PDF
                  </button>
                </div>

                {/* The complaint description and buttons section. */}
                <div className="mb-3">
                  <textarea
                    id="issueDescription"
                    className="form-control"
                    placeholder="Describe your issue here..."
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    rows="4"
                    disabled={isExpired}
                  />
                </div>

                <div className="d-flex justify-content-between gap-2">
                  <button
                    className="btn btn-primary help"
                    onClick={handleSendEmail}
                    disabled={isExpired}
                  >
                    Send Complaint
                  </button>
                  <DeleteWarranty
                    id={warranty.warrantyId}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </div>
              </div>
              <div className="button-container mt-4 help d-flex justify-content-end">
                <Link to="/dashboard" className="btn btn-secondary help">
                  Back
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
