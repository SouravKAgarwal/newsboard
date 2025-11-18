import { getArticles, getSources } from "@/lib/get-articles";
import Feed from "../_components/feed";

export const revalidate = 30;

export default async function SourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articles = await getArticles(id);

  return <Feed articles={articles} />;
}

export async function generateStaticParams() {
  const sources = await getSources();

  return sources.map((s) => ({
    id: s.key,
  }));
}
