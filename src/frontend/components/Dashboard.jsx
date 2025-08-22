import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../context/axiosInstance";
import DeleteWarranty from "./DeleteWarranty"; // Import the DeleteWarranty component

function Dashboard() {
  const { user } = useAuth();
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to fetch the list of warranties
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

  // Fetch warranties on initial component mount
  useEffect(() => {
    fetchWarranties();
  }, []);

  // Handler for navigating to warranty details
  const handleWarrantyClick = (id) => {
    navigate(`/warranties/details/${id}`);
  };

  if (loading) {
    return <div className="alert alert-info">Loading warranties...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Welcome back, {user?.username}!</h1>

      <div className="mb-4">
        <h4>Your Warranties:</h4>
      </div>

      {warranties.length === 0 ? (
        <div className="alert alert-warning">No warranties found.</div>
      ) : (
        <ul className="list-group">
          {warranties.map((warranty) => (
            <li
              key={warranty.warrantyId}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="flex-grow-1">
                <span className="fw-bold">{warranty.productName}</span>
                <small className="text-muted ms-3">
                  (Expires: {warranty.warrantyExpireDate})
                </small>
              </div>
              <div>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleWarrantyClick(warranty.warrantyId)}
                >
                  View Details
                </button>
                {/* Pass the fetchWarranties function as a prop */}
                <DeleteWarranty
                  id={warranty.warrantyId}
                  onDeleteSuccess={fetchWarranties}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="text-center mt-5">
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
