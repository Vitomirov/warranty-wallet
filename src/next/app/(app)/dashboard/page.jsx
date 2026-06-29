import Dashboard from "@/components/warranties/Dashboard";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata("/dashboard");

export default function DashboardPage() {
  return (
    <>
      <Dashboard />
      <BackToTopButton />
    </>
  );
}
