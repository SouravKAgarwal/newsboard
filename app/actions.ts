"use server";

import { getArticles, IArticleResponse } from "@/lib/get-articles";

export async function fetchMoreArticles(
    page: number,
    sourceKey?: string
): Promise<IArticleResponse[]> {
    return await getArticles(sourceKey, page);
}
