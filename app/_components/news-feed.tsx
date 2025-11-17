"use client";

import { useState, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import type { ISourceResponse } from "@/lib/get-articles";
import Badge from "./badge";
import Link from "next/link";
import FeedSkeleton from "./feed-skeleton";

export default function NewsFeed({
  initialArticles,
  sources,
}: {
  initialArticles: any[];
  sources: ISourceResponse[];
}) {
  const [selectedSourceId, setSelectedSourceId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [hasMore, setHasMore] = useState(true);

  const filteredArticles = useMemo(() => {
    if (selectedSourceId === null) {
      return initialArticles;
    }
    return initialArticles.filter((a) => a.sourceId === selectedSourceId);
  }, [initialArticles, selectedSourceId]);

  const articles = filteredArticles.slice(0, visibleCount);

  const fetchMoreData = () => {
    setTimeout(() => {
      const newCount = visibleCount + 12;
      if (newCount >= filteredArticles.length) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setVisibleCount(newCount);
    }, 1000);
  };

  const handleSourceClick = (sourceId: number | null) => {
    setSelectedSourceId(sourceId);
    setVisibleCount(12);
    setHasMore(true);
  };

  return (
    <div>
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
        <Link href="/live">
          <Badge>Live</Badge>
        </Link>
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

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<FeedSkeleton />}
        endMessage={
          <div className="my-10 text-center">
            <hr className="border-gray-200 mb-4" />
            <p className="text-gray-400 text-sm tracking-wide">
              {articles.length === 0
                ? "No articles found for this source."
                : "No more stories to display."}
            </p>
          </div>
        }
      >
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <article
              key={a.id}
              className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={40}
                  loading={i < 3 ? "eager" : undefined}
                  fetchPriority={i < 3 ? "high" : undefined}
                />
              </div>

              <div className="flex flex-col justify-between p-5 flex-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                      {a.sourceName}
                    </span>
                    {a.publishedAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(a.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-3">
                    {a.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                    {a.summary}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">
                    {a.readTimeMins} min read
                  </span>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors text-sm"
                  >
                    Read →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      </InfiniteScroll>
    </div>
  );
}
