import { IArticleResponse } from "@/lib/get-articles";
import dynamic from "next/dynamic";
import Image from "next/image";
const TimeAgo = dynamic(() => import("./time-ago"));

function Feed({ articles }: { articles: IArticleResponse[] }) {
  return (
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
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={40}
              loading={i < 6 ? "eager" : undefined}
              priority={i < 3}
              fetchPriority={i < 6 ? "high" : undefined}
              unoptimized
            />
          </div>

          <div className="flex flex-col justify-between p-5 flex-1">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                  {a.sourceName}
                </span>
                {a.publishedAt && <TimeAgo date={a.publishedAt} />}
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
                className="font-semibold inline-flex gap-1.5 items-center text-red-600 hover:text-red-700 transition-colors text-sm"
              >
                Read More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 14 14"
                  id="Arrow-Right--Streamline-Font-Awesome"
                  height="14"
                  width="14"
                >
                  <path
                    d="M13.572875 7.6921625c0.382834375 -0.38283125 0.382834375 -1.00455625 0 -1.3873875L8.6726 1.4045c-0.38283125 -0.382834375 -1.004553125 -0.382834375 -1.3873875 0s-0.382834375 1.00455625 0 1.387390625l3.231115625 3.228053125H1.12005625C0.5779625 6.01994375 0.14 6.45790625 0.14 7s0.4379625 0.980053125 0.98005625 0.980053125h9.393209375L7.288275 11.208109375c-0.382834375 0.382834375 -0.382834375 1.00455625 0 1.387390625s1.00455625 0.382834375 1.3873875 0L13.5759375 7.695225Z"
                    fill="#000000"
                    strokeWidth="0.0313"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export default Feed;
