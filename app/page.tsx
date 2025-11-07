"use client";
import { useState, useEffect } from "react";

interface ArticleData {
  id: number;
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
  readTimeMins: number;
  sourceName: string;
}

export default function Home() {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [q, setQ] = useState("");

  async function fetchArticles() {
    const res = await fetch(`/api/articles?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setArticles(data);
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Global Headlines</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchArticles();
        }}
        className="mb-6 flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search news..."
          className="flex-1 border rounded p-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      <div className="grid gap-4">
        {articles.map((a) => (
          <article
            key={a.id}
            className="border rounded p-4 hover:shadow transition bg-white"
          >
            <div className="text-sm text-gray-500">
              {a.sourceName} • {new Date(a.publishedAt).toLocaleString()}
            </div>
            <h2 className="text-xl font-semibold mt-1">{a.title}</h2>
            <p className="mt-2 text-gray-700">{a.summary}</p>
            <div className="mt-3 flex justify-between text-sm text-gray-600">
              <span>{a.readTimeMins} min read</span>
              <a
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                Read More →
              </a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
