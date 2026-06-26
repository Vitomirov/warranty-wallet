import MarketingLayout from "@/components/layout/MarketingLayout";
import LoginForm from "@/components/auth/LoginForm";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata("/login");

export default function LoginPage() {
  return (
    <>
      <MarketingLayout>
        <LoginForm />
      </MarketingLayout>
      <BackToTopButton />
    </>
  );
}
