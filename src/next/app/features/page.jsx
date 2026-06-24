import MarketingLayout from "@/components/layout/MarketingLayout";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata("/features");

export default function FeaturesPage() {
  return (
    <>
      <MarketingLayout>
        <FeaturesSection />
      </MarketingLayout>
      <BackToTopButton />
    </>
  );
}
