import Feed from "../_components/feed";
import { getArticles, getSources } from "@/lib/get-articles";
import { notFound } from "next/navigation";

export const revalidate = 30;

export default async function SourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sources = await getSources();

  const source = sources.find((s) => s.key === id);
  if (!source) notFound();

  const articles = await getArticles(id, 1);

  return <Feed articles={articles} sourceKey={id} />;
}

export async function generateStaticParams() {
  const sources = await getSources();

  return sources.map((s) => ({
    id: s.key,
  }));
}
