CREATE TABLE "live-articles" (
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
	CONSTRAINT "live-articles_url_unique" UNIQUE("url"),
	CONSTRAINT "live-articles_fingerprint_unique" UNIQUE("fingerprint")
);
--> statement-breakpoint
ALTER TABLE "live-articles" ADD CONSTRAINT "live-articles_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;