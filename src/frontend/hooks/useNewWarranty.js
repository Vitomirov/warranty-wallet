import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import useSecureRequest from "./useSecureRequest";

const useNewWarranty = () => {
  const navigate = useNavigate();
  const { secureRequest } = useSecureRequest();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // This handles all form inputs using a single state object
  const [formData, setFormData] = useState({
    productName: "",
    dateOfPurchase: null,
    warrantyExpireDate: null,
    file: null,
    sellersEmail: "",
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDateChange = (date, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

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

    // Basic form validation
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    handleInputChange,
    handleDateChange,
    handleAddWarranty,
    message,
    loading,
  };
};

export default useNewWarranty;
