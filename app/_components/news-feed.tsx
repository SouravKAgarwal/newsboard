"use client";

import { useState, useMemo, Suspense } from "react";
import type { IArticleResponse, ISourceResponse } from "@/lib/get-articles";
import Feed from "./feed";
import FeedSkeleton from "./feed-skeleton";

export default function NewsFeed({
  initialArticles,
  sources,
}: {
  initialArticles: IArticleResponse[];
  sources: ISourceResponse[];
}) {
  const [selectedSourceId, setSelectedSourceId] = useState<number | null>(null);

  const filteredArticles = useMemo(() => {
    if (selectedSourceId === null) return initialArticles;
    return initialArticles.filter((a) => a.sourceId === selectedSourceId);
  }, [initialArticles, selectedSourceId]);

  const handleSourceClick = (sourceId: number | null) => {
    setSelectedSourceId(sourceId);
  };

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-3 items-center">
        <button
          onClick={() => handleSourceClick(null)}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm ${
            selectedSourceId === null
              ? "bg-black text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Sources
        </button>

        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => handleSourceClick(source.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm whitespace-nowrap ${
              selectedSourceId === source.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {source.name}
          </button>
        ))}
      </div>

      <Suspense fallback={<FeedSkeleton />}>
        <Feed articles={filteredArticles} />
      </Suspense>
    </>
  );
}
