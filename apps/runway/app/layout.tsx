import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "../env";

export const metadata: Metadata = {
  title: "runway",
  description: "Shows where money goes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
