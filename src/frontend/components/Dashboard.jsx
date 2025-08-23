import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../context/axiosInstance";
import DeleteWarranty from "./DeleteWarranty";

function Dashboard() {
  const { user } = useAuth();
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- measure row height ---
  const listRef = useRef(null);
  const [rowH, setRowH] = useState(0);

  const measureRow = () => {
    if (!listRef.current) return;
    const firstItem = listRef.current.querySelector("li");
    if (firstItem) {
      const h = firstItem.getBoundingClientRect().height;
      if (h) setRowH(Math.ceil(h));
    }
  };

  const fetchWarranties = async () => {
    try {
      const response = await axiosInstance.get("/warranties/all");
      setWarranties(response.data || []);
    } catch (err) {
      console.error("Failed to fetch warranties:", err);
      setError("Failed to load warranties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  // Re-measure when data arrives or window resizes
  useEffect(() => {
    measureRow();
    const onResize = () => measureRow();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [warranties]);

  const handleWarrantyClick = (id) => navigate(`/warranties/details/${id}`);

  if (loading)
    return <div className="alert alert-info">Loading warranties...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container">
      <h1 className="text-center mb-4">Welcome back, {user?.username}!</h1>

      <div className="mb-3">
        <h4>Your Warranties:</h4>
      </div>

      {warranties.length === 0 ? (
        <div className="alert alert-warning">No warranties found.</div>
      ) : (
        // Scrollable area: exactly 3 rows tall
        <div
          style={{
            maxHeight: rowH ? rowH * 3 : undefined,
            overflowY: "auto",
            overflowX: "hidden",
          }}
          ref={listRef}
        >
          <ul className="list-group mb-0">
            {warranties.map((warranty) => (
              <li key={warranty.warrantyId} className="list-group-item">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                  {/* Leva strana: naziv i datum */}
                  <div className="mb-2 mb-sm-0">
                    <div className="fw-bold">{warranty.productName}</div>
                    <small className="text-muted">
                      Expires: {warranty.warrantyExpireDate}
                    </small>
                  </div>

                  {/* Desna strana: dugmad */}
                  <div className="d-flex flex-row flex-sm-row gap-2 mt-2 mt-sm-0">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleWarrantyClick(warranty.warrantyId)}
                    >
                      View
                    </button>
                    <DeleteWarranty
                      id={warranty.warrantyId}
                      onDeleteSuccess={fetchWarranties}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center mt-4">
        <button
          className="btn btn-success btn-lg"
          onClick={() => navigate("/newWarranty")}
        >
          + Add New Warranty
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
