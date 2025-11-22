"use client";

import type { IArticleResponse } from "@/lib/get-articles";
import { ArticleCard } from "./article-card";
import { useState, useTransition, useEffect } from "react";
import { fetchMoreArticles } from "@/app/actions";

interface FeedProps {
  articles: IArticleResponse[];
  sourceKey?: string;
}

export default function Feed({
  articles: initialArticles,
  sourceKey,
}: FeedProps) {
  const [articles, setArticles] = useState<IArticleResponse[]>(initialArticles);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setArticles(initialArticles);
    setPage(1);
    setHasMore(initialArticles.length >= 12);
  }, [initialArticles]);

  const loadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1;
      const newArticles = await fetchMoreArticles(nextPage, sourceKey);

      if (newArticles.length < 12) {
        setHasMore(false);
      }

      if (newArticles.length > 0) {
        setArticles((prev) => [...prev, ...newArticles]);
        setPage(nextPage);
      }
    });
  };

  // if ( articles.length === 0) {
  //   return (
  //     <div className="flex flex-col items-center justify-center py-20 text-center">
  //       <div className="bg-gray-100 rounded-full p-6 mb-4">
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           fill="none"
  //           viewBox="0 0 24 24"
  //           strokeWidth={1.5}
  //           stroke="currentColor"
  //           className="w-10 h-10 text-gray-400"
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
  //           />
  //         </svg>
  //       </div>
  //       <h3 className="text-lg font-semibold text-gray-900 mb-1">
  //         No articles found
  //       </h3>
  //       <p className="text-gray-500 max-w-sm mx-auto">
  //         We couldn't find any articles matching your search. Try adjusting your
  //         keywords or checking back later.
  //       </p>
  //     </div>
  //   );
  // }

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
