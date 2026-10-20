import Link from "next/link";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";

export default function Header() {
  return (
    <header className="siteHeader">
      <Link className="brand" href="/">
        NoteHub
      </Link>
      <AuthNavigation />
    </header>
  );
}
