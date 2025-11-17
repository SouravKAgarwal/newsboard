import LiveFeed from "../_components/live-feed";
import Link from "next/link";
import { getLiveArticles } from "@/lib/get-articles";

export default async function LivePage() {
  const articles = await getLiveArticles();

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 text-[#1C1C1C]">
      <header className="mb-10">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block"
        >
          ← Back to All News
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight uppercase mt-4">
          Live Feed
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Latest breaking news from top sources
        </p>
      </header>

      <LiveFeed initialArticles={articles} />
    </main>
  );
}
