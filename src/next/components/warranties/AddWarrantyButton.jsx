import Button from "@/components/ui/Button";

export default function AddWarrantyButton({ onClick }) {
  return (
    <div className="text-center mt-3">
      <Button variant="success" onClick={onClick}>
        + Add New Warranty
      </Button>
    </div>
  );
}
