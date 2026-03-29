import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ContextMe — Your AI-Powered Second Brain",
  description:
    "Paste any link or text, AI extracts key insights, connects them to your saved knowledge, and builds a searchable second brain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased bg-[#faf8f5] text-[#1c1917]`}
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        <div className="mesh-gradient">
          <div className="mesh-blob mesh-blob-violet" />
          <div className="mesh-blob mesh-blob-teal" />
          <div className="mesh-blob mesh-blob-amber" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
