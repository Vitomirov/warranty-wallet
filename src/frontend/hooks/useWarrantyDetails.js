import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import useSecureRequest from "./useSecureRequest";
import axios from "axios";

const calculateDaysLeft = (expiryDate) => {
  if (!expiryDate || typeof expiryDate !== "string") {
    return { days: 0, isExpired: true };
  }
  const dateParts = expiryDate.split("-");
  if (dateParts.length !== 3) {
    return { days: 0, isExpired: true };
  }
  const [day, month, year] = dateParts.map(Number);
  const expiry = new Date(year, month - 1, day);
  const currentDate = new Date();
  const timeLeft = expiry - currentDate;
  const isExpiredResult = timeLeft <= 0;
  return {
    days: isExpiredResult ? 0 : Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
    isExpired: isExpiredResult,
  };
};

const useWarrantyDetails = () => {
  const { id } = useParams();
  const { secureRequest } = useSecureRequest();

  const [warranty, setWarranty] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [issueDescription, setIssueDescription] = useState("");
  const [daysLeft, setDaysLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  const fetchWarranty = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await secureRequest("get", `/warranties/${id}`);
      setWarranty(response.data);
      const { days, isExpired: expired } = calculateDaysLeft(
        response.data.warrantyExpireDate
      );
      setDaysLeft(days);
      setIsExpired(expired);
    } catch (error) {
      setError("Failed to fetch warranty details.");
    } finally {
      setLoading(false);
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
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, "_blank");
    } catch (error) {
      setError("Error fetching warranty PDF.");
    }
  }, [warranty?.warrantyId, secureRequest]);

  const handleSendEmail = useCallback(
    async (user) => {
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
        setError("Error sending email. Please try again.");
      }
    },
    [warranty, issueDescription, secureRequest]
  );

  const handleIssueChange = (e) => setIssueDescription(e.target.value);

  useEffect(() => {
    if (id) {
      fetchWarranty();
    } else {
      setError("ID is missing");
      setLoading(false);
    }
  }, [id, fetchWarranty]);

  return {
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
  };
};

export default useWarrantyDetails;
