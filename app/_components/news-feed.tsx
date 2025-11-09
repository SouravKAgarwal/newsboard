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
    const newCount = visibleCount + 10;
    setArticles(initialArticles.slice(0, newCount));
    setVisibleCount(newCount);
    if (newCount >= initialArticles.length) setHasMore(false);
  };

  return (
    <InfiniteScroll
      dataLength={articles.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<p className="text-center text-gray-500 my-6">Loading...</p>}
      endMessage={
        <p className="text-center text-gray-400 mt-6">
          You’ve reached the end.
        </p>
      }
    >
      <section className="grid gap-8">
        {articles.map((a) => (
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
                  preload
                  quality={50}
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
