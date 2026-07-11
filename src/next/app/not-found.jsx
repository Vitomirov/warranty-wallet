import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="mb-3">Page not found</h1>
      <p className="text-muted mb-4">
        The page you are looking for does not exist.
      </p>
      <Link href="/">
        <Button variant="primary">Go home</Button>
      </Link>
    </div>
  );
}
