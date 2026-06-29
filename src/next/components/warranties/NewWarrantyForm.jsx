"use client";

import { memo } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import useNewWarranty from "@/hooks/warranties/useNewWarranty";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";

const DatePicker = dynamic(() => import("react-datepicker"), {
  ssr: false,
  loading: () => <div>Loading date picker...</div>,
});

const NewWarrantyForm = () => {
  const {
    formData,
    fields,
    handleInputChange,
    handleDateChange,
    handleAddWarranty,
    message,
    loading,
  } = useNewWarranty();

  return (
    <div className="container col-12 col-md-10 col-lg-8 my-5 pt-5">
      <h1 className="text-center mb-4">Enter Warranty Details</h1>
      <div className="row justify-content-center">
        <div className="col-12">
          <form onSubmit={handleAddWarranty}>
            {fields.map((f) =>
              f.type === "date" ? (
                <div key={f.id} className="mb-2">
                  <label htmlFor={f.id}>{f.label}</label>
                  <DatePicker
                    id={f.id}
                    selected={formData[f.key]}
                    onChange={(d) => handleDateChange(d, f.key)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control form-control-md form-style"
                    wrapperClassName="datepickerFullWidth"
                    placeholderText={f.placeholder}
                  />
                </div>
              ) : (
                <div key={f.id} className="mb-2">
                  <label htmlFor={f.id}>{f.label}</label>
                  <input
                    id={f.id}
                    name={f.name}
                    type={f.type}
                    value={
                      f.type !== "file" ? formData[f.name] || "" : undefined
                    }
                    onChange={handleInputChange}
                    className="form-control form-control-md form-style"
                    required={f.required}
                    accept={f.accept}
                  />
                </div>
              )
            )}

            {message && <div className="alert alert-info mt-4">{message}</div>}

            <div className="mt-5 d-flex justify-content-between">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Adding..." : "Add Warranty"}
              </Button>
              <Link href="/dashboard">
                <Button variant="secondary">Back</Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(NewWarrantyForm);
