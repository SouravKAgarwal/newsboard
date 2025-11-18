import { getArticles } from "@/lib/get-articles";
import { cacheLife } from "next/cache";
import Feed from "./_components/feed";

export default async function Home() {
  "use cache";
  cacheLife("news");
  const articles = await getArticles();

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

      <Feed articles={articles} />
    </main>
  );
}
