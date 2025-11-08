import { getArticles } from "@/lib/get-articles";
import NewsFeed from "./_components/news-feed";
import { cacheLife } from "next/cache";

export default async function Home() {
  "use cache";
  cacheLife("minutes");
  const articles = await getArticles();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 text-[#1C1C1C]">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight uppercase">
          Global Headlines
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Curated from trusted international sources
        </p>
      </header>

      <NewsFeed initialArticles={articles} />
    </main>
  );
}
