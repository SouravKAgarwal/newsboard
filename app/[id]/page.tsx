import { getArticles, getSources } from "@/lib/get-articles";
import Feed from "../_components/feed";
import { Metadata } from "next";

export const revalidate = 30;


export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const sources = await getSources();
  const source = sources.find((s) => s.key === id);

  return {
    title: source ? `${source.name} - Global Headlines` : "Global Headlines",
  };
}

export default async function SourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ query?: string }>;
}) {
  const { id } = await params;
  const { query } = await searchParams;
  const articles = await getArticles(id, 1, query);

  return <Feed articles={articles} query={query} sourceKey={id} />;
}

export async function generateStaticParams() {
  const sources = await getSources();

  return sources.map((s) => ({
    id: s.key,
  }));
}
