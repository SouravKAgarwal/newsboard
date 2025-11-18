import { IArticleResponse } from "@/lib/get-articles";
import Image from "next/image";
import { TimeAgo, TimeAgoSkeleton } from "./time-ago";
import { Suspense } from "react";

function Feed({ articles }: { articles: IArticleResponse[] }) {
  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-400">No articles available at the moment.</p>
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
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={40}
                loading={i < 6 ? "eager" : undefined}
                priority={i < 3}
                fetchPriority={i < 6 ? "high" : undefined}
              />
            </div>

            <div className="flex flex-col justify-between p-5 flex-1">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                    {a.sourceName}
                  </span>
                  <Suspense fallback={<TimeAgoSkeleton />}>
                    {a.publishedAt && <TimeAgo date={a.publishedAt} />}
                  </Suspense>
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
  );
}

export default Feed;
