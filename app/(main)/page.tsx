import { getArticles } from "@/lib/get-articles";
import type { Metadata } from "next";
import Feed from "../_components/feed";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Home - Global Headlines",
  description:
    "Get curated news from trusted international sources. Stay updated with the latest headlines from around the world.",
};

export default async function Home() {
  const articles = await getArticles(undefined, 1);

  return <Feed articles={articles} />;
}
