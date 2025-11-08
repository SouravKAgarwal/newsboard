import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import * as cheerio from "cheerio";
import crypto from "crypto";
import readingTime from "reading-time";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { articles, sources } from "@/drizzle/schema";

type SourceInfo = {
  key: string;
  name: string;
  feed: string;
};

const SOURCES: SourceInfo[] = [
  {
    key: "cnbc",
    name: "CNBC",
    feed: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
  },
  { key: "bbc", name: "BBC", feed: "https://feeds.bbci.co.uk/news/rss.xml" },
  {
    key: "the-hindu",
    name: "The Hindu",
    feed: "https://www.thehindu.com/news/national/?service=rss",
  },
  {
    key: "bloomberg",
    name: "Bloomberg",
    feed: "https://www.bloomberg.com/feed/podcast/etf-report.xml",
  },
  {
    key: "espn",
    name: "ESPN",
    feed: "https://www.espn.com/espn/rss/news",
  },
  {
    key: "sky-sports",
    name: "Sky Sports",
    feed: "https://www.skysports.com/rss/12040",
  },
];

const fingerprint = (text: string) =>
  crypto.createHash("sha256").update(text).digest("hex");

const cleanHtml = (html: string) =>
  cheerio
    .load(html || "")("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

const extractImage = (item: any): string | null => {
  const media = item["media:content"]?.[0]?.$.url;
  const enclosure = item.enclosure?.[0]?.$.url;
  const desc = item.description?.[0] || "";
  const $ = cheerio.load(desc);
  const img = $("img").attr("src");

  return media || enclosure || img || null;
};

async function ensureSources() {
  for (const s of SOURCES) {
    const exists = await db
      .select()
      .from(sources)
      .where(eq(sources.key, s.key));
    if (exists.length === 0) {
      await db.insert(sources).values({
        key: s.key,
        name: s.name,
        feedUrl: s.feed,
      });
    }
  }
}

async function parseFeed(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch feed: ${res.statusText}`);
    const xml = await res.text();
    const json = await parseStringPromise(xml);
    return json.rss.channel[0].item || [];
  } catch (error) {
    console.error(`Error parsing feed ${url}:`, error);
    return [];
  }
}

async function scrape() {
  try {
    await ensureSources();

    console.log("🧹 Clearing existing articles...");
    await db.delete(articles);
    console.log("✅ All previous articles deleted.");

    for (const src of SOURCES) {
      console.log("Fetching", src.name);
      const items = await parseFeed(src.feed);

      const [source] = await db
        .select()
        .from(sources)
        .where(eq(sources.key, src.key));

      if (!source) {
        console.error(`Source not found for key: ${src.key}`);
        continue;
      }

      for (const item of items.slice(0, 40)) {
        const title = item.title?.[0];
        const url = item.link?.[0];
        const content =
          item["content:encoded"]?.[0] || item.description?.[0] || "";
        const text = cleanHtml(content);
        const summary = text.slice(0, 400);
        const publishedAt = item.pubDate ? new Date(item.pubDate[0]) : null;
        const image = extractImage(item);

        // Skip any incomplete articles
        if (!title || !url || !summary || !image || !publishedAt) {
          console.warn(
            `⚠️ Skipping incomplete article: ${title || "Untitled"}`
          );
          continue;
        }

        const fp = fingerprint(title + summary);
        const readTimeMins = Math.max(1, Math.round(readingTime(text).minutes));

        try {
          await db.insert(articles).values({
            sourceId: source.id,
            title,
            url,
            summary,
            content: text,
            fingerprint: fp,
            readTimeMins,
            language: "en",
            publishedAt,
            image,
          });
          console.log(`✅ Inserted: ${title}`);
        } catch {
          console.log(`⏭️ Duplicate skipped: ${title}`);
        }
      }
    }

    console.log("🎉 Scraping complete!");
  } catch (error) {
    console.error("❌ Scraping failed:", error);
  } finally {
    process.exit(0);
  }
}

scrape();
