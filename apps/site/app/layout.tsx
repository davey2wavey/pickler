import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import "../env";
import { Footer } from "@/components/footer";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "David Pickler",
  description:
    "Internal tools, dashboards, automations, and iPhone apps, built and shipped alone. Rooms by platform, with the live ones inside.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        {children}
        <Footer />
      </body>
    </html>
  );
}
