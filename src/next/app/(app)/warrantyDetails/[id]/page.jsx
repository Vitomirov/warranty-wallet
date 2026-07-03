import WarrantyDetails from "@/components/warranties/WarrantyDetails";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata("/warrantyDetails");

export default function WarrantyDetailsPage() {
  return (
    <>
      <WarrantyDetails />
      <BackToTopButton />
    </>
  );
}
