import MyAccount from "@/components/account/MyAccount";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata("/myAccount");

export default function MyAccountPage() {
  return (
    <>
      <MyAccount />
      <BackToTopButton />
    </>
  );
}