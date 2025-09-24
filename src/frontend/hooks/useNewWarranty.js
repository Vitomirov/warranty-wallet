import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import useSecureRequest from "./useSecureRequest";

const useNewWarranty = () => {
  const navigate = useNavigate();
  const { secureRequest } = useSecureRequest();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    dateOfPurchase: null,
    warrantyExpireDate: null,
    file: null,
    sellersEmail: "",
  });

  // Field definition
  const fields = useMemo(
    () => [
      {
        label: "Product Name",
        id: "productName",
        name: "productName",
        type: "text",
        required: true,
      },
      {
        label: "Seller's Email",
        id: "sellersEmail",
        name: "sellersEmail",
        type: "email",
        required: true,
      },
      {
        label: "Purchase Date",
        id: "dateOfPurchase",
        key: "dateOfPurchase",
        type: "date",
        placeholder: "Select purchase date",
      },
      {
        label: "Expiry Date",
        id: "warrantyExpireDate",
        key: "warrantyExpireDate",
        type: "date",
        placeholder: "Select expiry date",
      },
      {
        label: "Upload PDF File",
        id: "file",
        name: "file",
        type: "file",
        accept: "application/pdf",
        required: true,
      },
    ],
    []
  );

  const handleInputChange = useCallback((e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  }, []);

  const handleDateChange = useCallback((date, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  }, []);

  const handleAddWarranty = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const {
      productName,
      dateOfPurchase,
      warrantyExpireDate,
      file,
      sellersEmail,
    } = formData;

    if (!dateOfPurchase || !warrantyExpireDate) {
      setMessage("Please select both purchase and expiry dates.");
      setLoading(false);
      return;
    }

    if (!file) {
      setMessage("Please upload the warranty receipt as a PDF file.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("productName", productName);
    data.append("dateOfPurchase", format(dateOfPurchase, "dd-MM-yyyy"));
    data.append("warrantyExpireDate", format(warrantyExpireDate, "dd-MM-yyyy"));
    data.append("pdfFile", file);
    data.append("sellersEmail", sellersEmail);

    try {
      await secureRequest("post", "/warranties", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Warranty created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating warranty:", error);
      setMessage("Error creating warranty.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    fields,
    handleInputChange,
    handleDateChange,
    handleAddWarranty,
    message,
    loading,
  };
};

export default useNewWarranty;
