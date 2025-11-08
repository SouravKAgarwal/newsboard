import "server-only";

import { and, desc, eq, isNotNull } from "drizzle-orm";
import { articles, sources } from "@/drizzle/schema";
import { db } from "@/drizzle/db";

export type IArticleResponse = {
  id: number;
  title: string;
  url: string;
  summary: string;
  publishedAt: Date;
  readTimeMins: number;
  sourceName: string;
  image: string;
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
