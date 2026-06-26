import MarketingLayout from "@/components/layout/MarketingLayout";
import FAQSection from "@/components/marketing/FAQSection";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata("/faq");

export default function FAQPage() {
  return (
    <>
      <MarketingLayout>
        <FAQSection />
      </MarketingLayout>
      <BackToTopButton />
    </>
  );
}
