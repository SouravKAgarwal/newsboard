import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import * as cheerio from "cheerio";
import crypto from "crypto";
import readingTime from "reading-time";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { articles, sources } from "@/db/schema";

type SourceInfo = {
  key: string;
  name: string;
  feed: string;
};
const SOURCES: SourceInfo[] = [
  { key: "cnn", name: "CNN", feed: "http://rss.cnn.com/rss/edition.rss" },
  { key: "bbc", name: "BBC", feed: "https://feeds.bbci.co.uk/news/rss.xml" },
  {
    key: "aljazeera",
    name: "Al Jazeera",
    feed: "https://www.aljazeera.com/xml/rss/all.xml",
  },
  {
    key: "thehindu",
    name: "The Hindu",
    feed: "https://www.thehindu.com/news/national/?service=rss",
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

async function ensureSources() {
  for (const s of SOURCES) {
    const exists = await db
      .select()
      .from(sources)
      .where(eq(sources.key, s.key));

    if (exists.length === 0) {
      await db
        .insert(sources)
        .values({ key: s.key, name: s.name, feedUrl: s.feed });
    }
  }
}

async function parseFeed(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch feed: ${res.statusText}`);
    }
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

        if (!title || !url) {
          console.error("Skipping item: missing title or url");
          continue;
        }

        const content =
          item["content:encoded"]?.[0] || item.description?.[0] || "";
        const text = cleanHtml(content);
        const summary = text.slice(0, 400);
        const fp = fingerprint(title + summary);
        const readTimeMins = Math.max(1, Math.round(readingTime(text).minutes));
        const publishedAt = item.pubDate ? new Date(item.pubDate[0]) : null;

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
          });
          console.log(`Inserted: ${title}`);
        } catch (e) {
          console.error("Skip duplicate:", title);
        }
      }
    }
    console.log("Scraping done!");
  } catch (error) {
    console.error("Scraping failed:", error);
  } finally {
    process.exit(0);
  }
}

scrape();
