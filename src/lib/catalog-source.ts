import catalog from "@/content/cowork-hub-catalog.json";

export type CatalogKind = "plugins" | "skills" | "integrations";

const repository = catalog.repository.replace(/\.git$/, "");

/** GitVerse показывает содержимое по пути /content/master/. */
export function catalogGitUrl(kind: CatalogKind, slug: string, file?: string) {
  const parts = [kind, slug, ...(file ? file.split("/") : [])];
  return `${repository}/content/master/${parts.map(encodeURIComponent).join("/")}`;
}

/**
 * Поля готовы для будущего источника статистики. Публичный GitVerse не отдаёт
 * рейтинги и число скачиваний, поэтому пока значения не подставляются.
 */
export type CatalogMetrics = { rating?: number; ratingVotes?: number; downloads?: number };
export const CATALOG_METRICS: Partial<Record<`${CatalogKind}/${string}`, CatalogMetrics>> = {};

export function catalogMetrics(kind: CatalogKind, slug: string): CatalogMetrics {
  return CATALOG_METRICS[`${kind}/${slug}`] ?? {};
}
