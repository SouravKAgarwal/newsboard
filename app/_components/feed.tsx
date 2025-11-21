"use client";

import type { IArticleResponse } from "@/lib/get-articles";
import { ArticleCard } from "./article-card";
import { useState, useTransition, useEffect } from "react";
import { fetchMoreArticles } from "@/app/actions";

interface FeedProps {
  articles: IArticleResponse[];
  query?: string;
  sourceKey?: string;
}

export default function Feed({
  articles: initialArticles,
  query,
  sourceKey,
}: FeedProps) {
  const [articles, setArticles] = useState<IArticleResponse[]>(initialArticles);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setArticles(initialArticles);
    setPage(1);
    setHasMore(true);
  }, [initialArticles]);

  const loadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1;
      const newArticles = await fetchMoreArticles(nextPage, query, sourceKey);

      if (newArticles.length === 0) {
        setHasMore(false);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
        setPage(nextPage);
      }
    });
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a, i) => (
          <ArticleCard key={a.id} article={a} priority={i < 3} />
        ))}
      </section>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Loading..." : "Load More Articles"}
          </button>
        </div>
      )}
    </div>
  );
}
