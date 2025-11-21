import "server-only";

import { and, desc, eq, isNotNull, ne, or, sql, type SQL } from "drizzle-orm";
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
  sourceId: number;
  image: string;
};

export type ISourceResponse = {
  id: number;
  name: string;
  key: string;
};
export async function getArticles(
  key?: string,
  page: number = 1,
  query?: string
): Promise<IArticleResponse[]> {
  const pageSize = 12;
  const offset = (page - 1) * pageSize;

  const conditions: (SQL | undefined)[] = [
    isNotNull(articles.image),
    isNotNull(articles.summary),
    isNotNull(articles.publishedAt),
    isNotNull(articles.readTimeMins),
  ];

  if (key) {
    conditions.push(eq(sources.key, key));
  }

  if (query) {
    conditions.push(
      or(
        sql`${articles.title} ILIKE ${`%${query}%`}`,
        sql`${articles.summary} ILIKE ${`%${query}%`}`
      )!
    );
  }

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
    .where(and(...conditions))
    .orderBy(desc(articles.publishedAt))
    .limit(pageSize)
    .offset(offset);

  return rows as IArticleResponse[];
}

export async function getSources(): Promise<ISourceResponse[]> {
  const rows = await db.select().from(sources);
  return rows as ISourceResponse[];
}
