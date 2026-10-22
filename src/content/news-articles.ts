import items from "./news-articles.json";

export type NewsBlock = {
  kind: "paragraph" | "heading" | "listItem";
  text: string;
};

export type NewsArticle = {
  slug: string;
  date: string;
  title: string;
  sourceUrl: string;
  mediaUrl?: string;
  blocks: NewsBlock[];
};

export const NEWS_ARTICLES = items as NewsArticle[];
export const NEWS_ARTICLE_BY_SLUG = new Map(NEWS_ARTICLES.map((article) => [article.slug, article]));

export function newsDateLabel(date: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
