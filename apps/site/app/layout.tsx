import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "../env";

export const metadata: Metadata = {
  title: "site",
  description: "Portfolio. One dataset, many views.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
