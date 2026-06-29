import NewWarrantyForm from "@/components/warranties/NewWarrantyForm";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata("/newWarranty");

export default function NewWarrantyPage() {
  return (
    <>
      <NewWarrantyForm />
      <BackToTopButton />
    </>
  );
}