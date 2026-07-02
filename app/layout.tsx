import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/* Plus Jakarta Sans — a clean, slightly geometric sans that reads modern,
   professional SaaS (the register Linear/Vercel-class products live in). */
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CrewBoard — the team workspace that stays in sync",
  description:
    "A multi-tenant team task board demo: Supabase Auth, a relational Postgres schema, Row Level Security, and Realtime — built with Next.js by Alvin Salim.",
  openGraph: {
    title: "CrewBoard — team workspace (Supabase demo)",
    description:
      "Auth, relational schema, Row Level Security and Realtime — a real Supabase build in Next.js.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sans.variable}>
      <body style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
