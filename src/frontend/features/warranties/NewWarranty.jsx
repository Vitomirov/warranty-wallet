import React from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../ui/Button";
import useNewWarranty from "../../hooks/useNewWarranty";

const NewWarranty = () => {
  // Call the custom hook to get all necessary functions and state
  const {
    formData,
    handleInputChange,
    handleDateChange,
    handleAddWarranty,
    message,
    loading,
  } = useNewWarranty();

  return (
    <div className="help container-fluid d-flex flex-column justify-content-center align-items-center flex-grow-1">
      <div className="row content-layout help">
        <h1 className="col-12 display-5 mt-5 pt-3 montserrat text-center">
          Create New Warranty
        </h1>

        <div className="col-lg-6 col-md-8 col-sm-10 mx-auto mt-4">
          <form onSubmit={handleAddWarranty}>
            <div className="mb-3">
              <label htmlFor="productName">Product Name:</label>
              <input
                id="productName"
                name="productName"
                type="text"
                value={formData.productName}
                onChange={handleInputChange}
                className="form-control form-control-md form-style"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dateOfPurchase">Purchase Date:</label>
              <DatePicker
                id="dateOfPurchase"
                selected={formData.dateOfPurchase}
                onChange={(date) => handleDateChange(date, "dateOfPurchase")}
                dateFormat="dd/MM/yyyy"
                className="form-control form-control-md form-style"
                wrapperClassName="datepickerFullWidth"
                placeholderText="Select purchase date"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="warrantyExpireDate">Expiry Date:</label>
              <DatePicker
                id="warrantyExpireDate"
                selected={formData.warrantyExpireDate}
                onChange={(date) =>
                  handleDateChange(date, "warrantyExpireDate")
                }
                dateFormat="dd/MM/yyyy"
                className="form-control form-control-md form-style"
                wrapperClassName="datepickerFullWidth"
                placeholderText="Select expiry date"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="sellersEmail">Seller's email:</label>
              <input
                id="sellersEmail"
                name="sellersEmail"
                type="email"
                value={formData.sellersEmail}
                onChange={handleInputChange}
                className="form-control form-control-md form-style"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="file">Upload PDF File:</label>
              <input
                id="file"
                name="file"
                type="file"
                accept="application/pdf"
                onChange={handleInputChange}
                className="form-control form-control-md form-style"
                required
              />
            </div>

            {message && <div className="alert alert-info mt-4">{message}</div>}

            <div className="button mt-4 d-flex justify-content-between">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Adding..." : "Add Warranty"}
              </Button>
              <Link to="/dashboard" className="btn btn-secondary">
                Back
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewWarranty;
