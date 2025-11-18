import { getArticles } from "@/lib/get-articles";
import Feed from "./_components/feed";

export const revalidate = 30;

export default async function Home() {
  const articles = await getArticles();

  return <Feed articles={articles} />;
}
