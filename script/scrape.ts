import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import * as cheerio from "cheerio";
import crypto from "crypto";
import readingTime from "reading-time";
import pLimit from "p-limit";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { articles, sources } from "@/drizzle/schema";

// -------------------------------------------------
// 🧩 TYPES
// -------------------------------------------------
type SourceInfo = {
  key: string;
  name: string;
  feed: string;
};

type FeedItem = {
  title?: string[];
  link?: string[];
  description?: string[];
  pubDate?: string[];
  enclosure?: Array<{ $: { url: string } }>;
  ["media:content"]?: Array<{ $: { url: string } }>;
  ["media:thumbnail"]?: Array<{ $: { url: string } }>;
  ["content:encoded"]?: string[];
  [key: string]: any;
};

type ExtractedData = {
  title: string | null;
  desc: string;
  image: string | null;
};

// -------------------------------------------------
// 📡 SOURCE CONFIG
// -------------------------------------------------
const SOURCES: SourceInfo[] = [
  {
    key: "indian-express",
    name: "The Indian Express",
    feed: "https://indianexpress.com/feed/",
  },
  {
    key: "times-of-india",
    name: "Times of India",
    feed: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
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
    feed: "https://feeds.bloomberg.com/markets/news.rss",
  },
  {
    key: "espn",
    name: "ESPN Cricinfo",
    feed: "https://www.espncricinfo.com/rss/content/story/feeds/0.xml",
  },
  {
    key: "sky-sports",
    name: "Sky Sports",
    feed: "https://www.skysports.com/rss/12040",
  },
];

// -------------------------------------------------
// 🧠 HELPERS
// -------------------------------------------------
const fingerprint = (text: string): string =>
  crypto.createHash("sha256").update(text).digest("hex");

const cleanHtml = (html: string = ""): string =>
  cheerio.load(html)("body").text().replace(/\s+/g, " ").trim();

const extractImageGeneric = (item: FeedItem): string | null => {
  const media = item["media:content"]?.[0]?.$.url;
  const enclosure = item.enclosure?.[0]?.$.url;
  const desc = item.description?.[0] || "";
  const $ = cheerio.load(desc);
  const img = $("img").attr("src");
  return media || enclosure || img || null;
};

// -------------------------------------------------
// 🧩 SOURCE-SPECIFIC EXTRACTION
// -------------------------------------------------
const extractors: Record<string, (item: FeedItem) => ExtractedData> = {
  "times-of-india": (item) => ({
    image:
      item["media:content"]?.[0]?.$.url ||
      item["media:thumbnail"]?.[0]?.$.url ||
      extractImageGeneric(item),
    title: item.title?.[0]?.trim() ?? null,
    desc: cleanHtml(item.description?.[0] || ""),
  }),

  "indian-express": (item) => ({
    image:
      item["media:content"]?.[0]?.$.url ||
      item["media:thumbnail"]?.[0]?.$.url ||
      extractImageGeneric(item),
    title: item.title?.[0]?.trim() ?? null,
    desc: cleanHtml(item.description?.[0] || ""),
  }),

  bbc: (item) => ({
    image: item["media:thumbnail"]?.[0]?.$.url || extractImageGeneric(item),
    title: item.title?.[0]?.trim() ?? null,
    desc: cleanHtml(item.description?.[0] || ""),
  }),

  "the-hindu": (item) => {
    const desc = item.description?.[0] || "";
    const $ = cheerio.load(desc);
    const img =
      $("img").attr("src") ||
      item["media:content"]?.[0]?.$.url ||
      item.enclosure?.[0]?.$.url;
    return {
      image: img ?? null,
      title: item.title?.[0]?.trim() ?? null,
      desc: cleanHtml(desc),
    };
  },

  bloomberg: (item) => ({
    image:
      item["media:thumbnail"]?.[0]?.$.url ||
      item["media:content"]?.[0]?.$.url ||
      extractImageGeneric(item),
    title: item.title?.[0]?.trim() ?? null,
    desc: cleanHtml(item.description?.[0] || ""),
  }),

  espn: (item) => ({
    image:
      item["media:content"]?.[0]?.$.url ||
      item.enclosure?.[0]?.$.url ||
      extractImageGeneric(item),
    title: item.title?.[0]?.trim() ?? null,
    desc: cleanHtml(item.description?.[0] || ""),
  }),

  "sky-sports": (item) => ({
    image:
      item["media:content"]?.[0]?.$.url ||
      item.enclosure?.[0]?.$.url ||
      extractImageGeneric(item),
    title: item.title?.[0]?.trim() ?? null,
    desc: cleanHtml(item.description?.[0] || ""),
  }),
};

// -------------------------------------------------
// 🏗️ DATABASE UTILITIES
// -------------------------------------------------
async function ensureSources(): Promise<void> {
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

async function isDuplicate(fp: string): Promise<boolean> {
  const existing = await db
    .select()
    .from(articles)
    .where(eq(articles.fingerprint, fp));
  return existing.length > 0;
}

// -------------------------------------------------
// 📰 PARSE FEEDS
// -------------------------------------------------
async function parseFeed(url: string): Promise<FeedItem[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    const xml = await res.text();
    const json = (await parseStringPromise(xml)) as any;
    return json?.rss?.channel?.[0]?.item || [];
  } catch (err) {
    console.error(`❌ Error parsing ${url}:`, (err as Error).message);
    return [];
  }
}

// -------------------------------------------------
// 🚀 SCRAPER CORE
// -------------------------------------------------
async function scrape(): Promise<void> {
  try {
    await ensureSources();

    await db.delete(articles);
    console.log("🧹 Cleared articles table");

    const limit = pLimit(3);
    const tasks = SOURCES.map((src) =>
      limit(async () => {
        console.log(`🔍 Fetching ${src.name}`);
        const items = await parseFeed(src.feed);
        const extractor = extractors[src.key];

        const [source] = await db
          .select()
          .from(sources)
          .where(eq(sources.key, src.key));

        if (!source) {
          console.error(`Missing DB source for ${src.key}`);
          return;
        }

        for (const item of items.slice(0, 40)) {
          const { title, desc, image } = extractor(item);
          const url = item.link?.[0];
          const publishedAt = item.pubDate ? new Date(item.pubDate[0]) : null;

          if (!title || !url || !image) {
            console.warn(`⚠️ Skipping invalid item from ${src.name}`);
            continue;
          }

          const summary = desc.slice(0, 400);
          const fp = fingerprint(title + summary);
          const text = cleanHtml(desc);
          const readTimeMins = Math.max(
            1,
            Math.round(readingTime(text).minutes)
          );

          if (await isDuplicate(fp)) {
            console.log(`⏭️ Duplicate skipped: ${title}`);
            continue;
          }

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
          } catch (err) {
            console.error(`❌ DB insert error: ${(err as Error).message}`);
          }
        }
      })
    );

    await Promise.all(tasks);
    console.log("🎉 Scraping complete!");
  } catch (error) {
    console.error("❌ Fatal scrape error:", error);
  } finally {
    process.exit(0);
  }
}

scrape();
