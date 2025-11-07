CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" integer NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"summary" text,
	"content" text,
	"published_at" timestamp,
	"author" text,
	"image" text,
	"fingerprint" varchar(64) NOT NULL,
	"read_time_mins" integer,
	"language" varchar(10),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "articles_url_unique" UNIQUE("url"),
	CONSTRAINT "articles_fingerprint_unique" UNIQUE("fingerprint")
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"feed_url" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "sources_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;