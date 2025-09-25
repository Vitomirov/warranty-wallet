import React, { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import useWarranties from "../../hooks/useWarranties";
import useMeasure from "../../hooks/useMeasure";

const WarrantiesList = lazy(() => import("./WarrantiesList"));
const AddWarrantyButton = lazy(() => import("./AddWarrantyButton"));

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { warranties, loading, error, fetchWarranties } = useWarranties();
  const { ref: listRef, height: rowHeight } = useMeasure(warranties);

  if (loading) return null;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container col-12 col-md-10 col-lg-8 my-4">
      <h1 className="text-center mb-3 fw-bold">Hello, {user?.username}!</h1>
      <div className="mb-3">
        <h3 className="fw-lighter">Your Warranties:</h3>
      </div>

      <Suspense>
        <WarrantiesList
          warranties={warranties}
          listRef={listRef}
          rowHeight={rowHeight}
          onView={(id) => navigate(`/warranties/details/${id}`)}
          onDeleteSuccess={fetchWarranties}
        />
      </Suspense>

      <Suspense fallback={null}>
        <AddWarrantyButton onClick={() => navigate("/newWarranty")} />
      </Suspense>
    </div>
  );
}
