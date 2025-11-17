import { getArticles, getSources } from "@/lib/get-articles";
import { Suspense } from "react";
import FeedSkeleton from "./_components/feed-skeleton";
import NewsFeed from "./_components/news-feed";

export default async function Home() {
  const [articles, sources] = await Promise.all([getArticles(), getSources()]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 text-[#1C1C1C]">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight uppercase">
          Global Headlines
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Curated from trusted international sources
        </p>
      </header>

      <Suspense fallback={<FeedSkeleton />}>
        <NewsFeed initialArticles={articles} sources={sources} />
      </Suspense>
    </main>
  );
}
