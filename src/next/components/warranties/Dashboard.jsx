"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/AuthContext";
import useWarranties from "@/hooks/warranties/useWarranties";
import useMeasure from "@/hooks/useMeasure";
import WarrantiesList from "./WarrantiesList";
import AddWarrantyButton from "./AddWarrantyButton";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
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

      <WarrantiesList
        warranties={warranties}
        listRef={listRef}
        rowHeight={rowHeight}
        onView={(id) => router.push(`/warrantyDetails/${id}`)}
        onDeleteSuccess={fetchWarranties}
      />

      <AddWarrantyButton onClick={() => router.push("/newWarranty")} />
    </div>
  );
}
