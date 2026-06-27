import MarketingLayout from "@/components/layout/MarketingLayout";
import SignupForm from "@/components/auth/SignupForm";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata("/signup");

export default function SignupPage() {
  return (
    <>
      <MarketingLayout>
        <SignupForm />
      </MarketingLayout>
      <BackToTopButton />
    </>
  );
}
