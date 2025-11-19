import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { getSources } from "@/lib/get-articles";
import Matches from "./_components/matches";

export const metadata: Metadata = {
  title: "Global Headlines",
  description:
    "Get curated news from trusted international sources. Stay updated with the latest headlines from around the world.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sources = await getSources();
  return (
    <html lang="en" suppressHydrationWarning={true} data-scroll="smooth">
      <body className="scroll-smooth bg-gray-50 antialiased px-6">
        <header className="pt-10 pb-5">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight uppercase">
              Global Headlines
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Curated from trusted international sources
            </p>
          </div>
          <nav className="mt-8">
            <ul className="flex gap-5 flex-wrap py-2">
              <li>
                <Link
                  href="/"
                  className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium whitespace-nowrap transition-all hover:opacity-90"
                >
                  All Sources
                </Link>
              </li>

              {sources.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/${s.key}`}
                    className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium whitespace-nowrap transition-all hover:bg-gray-200"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <Matches />
        <main className="container max-w-7xl mx-auto pt-5 pb-10 text-[#1C1C1C]">
          {children}
        </main>
      </body>
    </html>
  );
}
