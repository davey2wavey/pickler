import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "../env";

export const metadata: Metadata = {
  title: "David Pickler",
  description: "Apps for iPhone, Mac, and the web, built and shipped alone.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
