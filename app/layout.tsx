import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSessionRole } from "@/lib/auth/server-session";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SIWES 360",
    template: "%s | SIWES 360",
  },
  description:
    "A SIWES management and grading frontend for students, supervisors, and departmental administrators.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialRole = await getServerSessionRole();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders initialRole={initialRole}>{children}</AppProviders>
      </body>
    </html>
  );
}
