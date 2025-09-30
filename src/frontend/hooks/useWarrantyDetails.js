import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import useSecureRequest from "./useSecureRequest";

const calculateDaysLeft = (expiryDate) => {
  if (!expiryDate) return { days: 0, isExpired: true };
  const [day, month, year] = expiryDate.split("-").map(Number);
  const expiry = new Date(year, month - 1, day);
  const diff = expiry - new Date();
  return {
    days: diff > 0 ? Math.floor(diff / 86400000) : 0,
    isExpired: diff <= 0,
  };
};

const useWarrantyDetails = () => {
  const { id } = useParams();
  const { secureRequest } = useSecureRequest();

  const [warranty, setWarranty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [issueDescription, setIssueDescription] = useState("");

  const fetchWarranty = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await secureRequest("get", `/warranties/${id}`);
      setWarranty(data);
      localStorage.setItem(`warranty-${id}`, JSON.stringify(data));
    } catch {
      setError("Failed to fetch warranty details.");
    } finally {
      setLoading(false);
    }
  }, [id, secureRequest]);

  useEffect(() => {
    if (!id) {
      setError("ID missing");
      setLoading(false);
      return;
    }

    const savedWarranty = localStorage.getItem(`warranty-${id}`);
    if (savedWarranty) {
      setWarranty(JSON.parse(savedWarranty));
      setLoading(false);
    } else {
      fetchWarranty();
    }
  }, [id, fetchWarranty]);

  const { days: daysLeft, isExpired } = useMemo(
    () => calculateDaysLeft(warranty?.warrantyExpireDate),
    [warranty]
  );

  const handleOpenPDF = useCallback(async () => {
    if (!warranty) return setError("Warranty not loaded.");
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
    } catch {
      setError("Error fetching warranty PDF.");
    }
  }, [warranty, secureRequest]);

  const handleSendEmail = useCallback(
    async (user) => {
      if (!warranty || !user)
        return setError("Cannot send email: missing data.");
      setError(null);
      try {
        await secureRequest("post", "/warranty/claim", {
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
      } catch {
        setError("Error sending email.");
      }
    },
    [warranty, issueDescription, secureRequest]
  );

  const handleIssueChange = (e) => setIssueDescription(e.target.value);

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
