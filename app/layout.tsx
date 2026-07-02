import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CrewBoard — team workspace (Supabase demo)",
  description:
    "A multi-tenant team task board demo: Supabase Auth, a relational Postgres schema, Row Level Security, and Realtime — built with Next.js by Alvin Salim.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
