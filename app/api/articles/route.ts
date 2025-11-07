import { NextRequest, NextResponse } from "next/server";
import { eq, ilike, and } from "drizzle-orm";
import { articles, sources } from "@/db/schema";
import { db } from "@/db/drizzle";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const src = url.searchParams.get("source") || "";
  const limit = parseInt(url.searchParams.get("limit") || "15");
  const offset = parseInt(url.searchParams.get("offset") || "0");

  let where = [];
  if (q) where.push(ilike(articles.title, `%${q}%`));
  if (src) where.push(eq(articles.sourceId, Number(src)));

  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      url: articles.url,
      summary: articles.summary,
      publishedAt: articles.publishedAt,
      readTimeMins: articles.readTimeMins,
      sourceName: sources.name,
    })
    .from(articles)
    .innerJoin(sources, eq(articles.sourceId, sources.id))
    .where(where.length ? and(...where) : undefined)
    .limit(limit)
    .offset(offset)
    .orderBy(articles.publishedAt);

  return NextResponse.json(rows);
}
