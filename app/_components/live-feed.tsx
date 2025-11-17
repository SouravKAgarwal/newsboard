"use client";

import { useState } from "react";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedSkeleton from "./feed-skeleton";
import type { IArticleResponse } from "@/lib/get-articles";

export default function LiveFeed({
  initialArticles,
}: {
  initialArticles: IArticleResponse[];
}) {
  const [articles, setArticles] = useState(initialArticles.slice(0, 12));
  const [visibleCount, setVisibleCount] = useState(12);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    setTimeout(() => {
      const newCount = visibleCount + 12;
      if (newCount >= initialArticles.length) {
        setHasMore(false);
      } else {
        setArticles(initialArticles.slice(0, newCount));
        setHasMore(true);
      }
      setVisibleCount(newCount);
    }, 1000);
  };

  return (
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
        {articles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">
              No articles available at the moment.
            </p>
          </div>
        ) : (
          articles.map((a, i) => (
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
                  priority={i <= 1}
                  fetchPriority={i < 3 ? "high" : undefined}
                />
              </div>

              <div className="flex flex-col justify-between p-5 flex-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                      {a.sourceName}
                    </span>
                    {a.publishedAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(a.publishedAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold leading-snug text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3">
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
                    className="font-semibold text-red-600 hover:text-red-700 transition-colors text-sm"
                  >
                    Read →
                  </a>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </InfiniteScroll>
  );
}
