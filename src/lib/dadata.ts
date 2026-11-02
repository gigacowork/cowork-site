/** Организация из подсказок DaData: только поля, нужные лид-форме. */
export type CompanySuggestion = { name: string; inn: string };

const API_URL =
  "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";

// Подсказки DaData вызываются из браузера, поэтому API-ключ виден в запросе.
// Секретный ключ для API стандартизации здесь не используется.
export const DADATA_API_KEY = process.env.NEXT_PUBLIC_DADATA_API_KEY ?? "";

export async function suggestCompanies(
  query: string,
  signal: AbortSignal,
): Promise<CompanySuggestion[]> {
  if (!DADATA_API_KEY) return [];

  const response = await fetch(API_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${DADATA_API_KEY}`,
    },
    body: JSON.stringify({ query, count: 5 }),
    signal,
  });
  if (!response.ok) throw new Error(`DaData ответила ${response.status}`);

  const data = (await response.json()) as {
    suggestions?: Array<{ value?: string; data?: { inn?: string } }>;
  };
  return (data.suggestions ?? []).flatMap((item) =>
    typeof item.value === "string" && typeof item.data?.inn === "string"
      ? [{ name: item.value, inn: item.data.inn }]
      : [],
  );
}
