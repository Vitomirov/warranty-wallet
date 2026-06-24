import MarketingLayout from "@/components/layout/MarketingLayout";
import AboutSection from "@/components/marketing/AboutSection";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata("/about");

export default function AboutPage() {
  return (
    <>
      <MarketingLayout>
        <AboutSection />
      </MarketingLayout>
      <BackToTopButton />
    </>
  );
}
