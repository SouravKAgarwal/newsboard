import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  feedUrl: text("feed_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id")
    .notNull()
    .references(() => sources.id),
  title: text("title").notNull(),
  url: text("url").notNull().unique(),
  summary: text("summary"),
  content: text("content"),
  publishedAt: timestamp("published_at"),
  author: text("author"),
  image: text("image"),
  fingerprint: varchar("fingerprint", { length: 64 }).notNull().unique(),
  readTimeMins: integer("read_time_mins"),
  language: varchar("language", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
