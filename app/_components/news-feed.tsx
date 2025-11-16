"use client";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";

export default function NewsFeed({
  initialArticles,
}: {
  initialArticles: any[];
}) {
  const [articles, setArticles] = useState(initialArticles.slice(0, 10));
  const [visibleCount, setVisibleCount] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    setTimeout(() => {
      const newCount = visibleCount + 10;
      const nextSlice = initialArticles.slice(0, newCount);

      setArticles(nextSlice);
      setVisibleCount(newCount);

      if (newCount >= initialArticles.length) {
        setHasMore(false);
      }
    }, 500);
  };

  return (
    <InfiniteScroll
      dataLength={articles.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        <div className="flex items-center justify-center my-8">
          <div className="animate-pulse text-gray-400 tracking-wide text-sm">
            Loading latest updates…
          </div>
        </div>
      }
      endMessage={
        <div className="my-10 text-center">
          <hr className="border-gray-200 mb-4" />
          <p className="text-gray-400 text-sm tracking-wide">
            No more stories to display.
          </p>
        </div>
      }
    >
      <section className="grid gap-8">
        {articles.map((a, i) => (
          <article
            key={a.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative md:w-[380px] md:h-[260px] w-full h-[220px] shrink-0">
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 380px"
                  quality={40}
                  loading={i < 3 ? "eager" : undefined}
                  fetchPriority={i < 3 ? "high" : undefined}
                />
              </div>

              <div className="flex flex-col justify-between p-6 flex-1">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    {a.sourceName}{" "}
                    {a.publishedAt && (
                      <>
                        • <span>{new Date(a.publishedAt).toDateString()}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold leading-snug">
                    {a.title}
                  </h2>
                  <p className="text-gray-600 mt-3 line-clamp-3">{a.summary}</p>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>{a.readTimeMins} min read</span>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-neutral-700 hover:text-black transition-colors"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </InfiniteScroll>
  );
}
