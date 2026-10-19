import type { Metadata } from "next";
import Link from "next/link";
import AuthNavigation from "@/components/AuthNavigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Notes and account pages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="siteHeader">
          <Link className="brand" href="/">
            NoteHub
          </Link>
          <AuthNavigation />
        </header>
        {children}
      </body>
    </html>
  );
}
