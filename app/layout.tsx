import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Headlines",
  description:
    "Get curated news from trusted international sources. Stay updated with the latest headlines from around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll="smooth">
      <body className="scroll-smooth bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
