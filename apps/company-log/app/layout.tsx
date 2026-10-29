import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "../env";

export const metadata: Metadata = {
  title: "company-log",
  description: "Every post from a company's socials, one place.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
