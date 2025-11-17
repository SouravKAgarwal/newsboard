import "server-only";

import { and, desc, eq, isNotNull } from "drizzle-orm";
import { articles, liveArticles, sources } from "@/drizzle/schema";
import { db } from "@/drizzle/db";

export type IArticleResponse = {
  id: number;
  title: string;
  url: string;
  summary: string;
  publishedAt: Date;
  readTimeMins: number;
  sourceName: string;
  sourceId: number;
  image: string;
};

export type ISourceResponse = {
  id: number;
  name: string;
  key: string;
};

export async function getArticles(): Promise<IArticleResponse[]> {
  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      url: articles.url,
      summary: articles.summary,
      publishedAt: articles.publishedAt,
      readTimeMins: articles.readTimeMins,
      sourceName: sources.name,
      sourceId: sources.id,
      image: articles.image,
    })
    .from(articles)
    .innerJoin(sources, eq(articles.sourceId, sources.id))
    .where(
      and(
        isNotNull(articles.image),
        isNotNull(articles.summary),
        isNotNull(articles.publishedAt),
        isNotNull(articles.readTimeMins)
      )
    )
    .orderBy(desc(articles.publishedAt));

  return rows as IArticleResponse[];
}

export async function getLiveArticles(): Promise<IArticleResponse[]> {
  const rows = await db
    .select({
      id: liveArticles.id,
      title: liveArticles.title,
      url: liveArticles.url,
      summary: liveArticles.summary,
      publishedAt: liveArticles.publishedAt,
      readTimeMins: liveArticles.readTimeMins,
      sourceName: sources.name,
      sourceId: sources.id,
      image: liveArticles.image,
    })
    .from(liveArticles)
    .innerJoin(sources, eq(liveArticles.sourceId, sources.id))
    .where(
      and(
        isNotNull(liveArticles.image),
        isNotNull(liveArticles.summary),
        isNotNull(liveArticles.publishedAt),
        isNotNull(liveArticles.readTimeMins)
      )
    )
    .orderBy(desc(liveArticles.publishedAt));

  return rows as IArticleResponse[];
}

export async function getSources(): Promise<ISourceResponse[]> {
  const rows = await db.select().from(sources);
  return rows as ISourceResponse[];
}
