import { getArticles } from "@/lib/get-articles";
import Feed from "./_components/feed";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const articles = await getArticles(undefined, 1, query);

  return <Feed articles={articles} query={query} />;
}
