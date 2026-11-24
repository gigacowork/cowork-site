import { EMPLOYER_ID } from "./content";

export type Vacancy = {
  id: string;
  name: string;
  alternateUrl: string;
  area?: { name: string };
  experience?: { name: string };
  professionalRoles?: { id: string }[] | null;
  salary?: { from?: number | null; to?: number | null; currency: string } | null;
  snippet?: { responsibility?: string | null; requirement?: string | null };
};

type VacanciesPage = {
  items: Vacancy[];
  found: number;
  pages: number;
};

// The public feed used by the embedded hh.ru widget. It serves data without
// exposing employer credentials in the static site.
const FEED_URL = "https://widgets.hh.ru/api/v1/hh-api/vacancies";
const FEED_PAGE_SIZE = 6;
const DEVELOPER_ROLE_ID = "96";

async function loadPage(page: number, signal: AbortSignal) {
  const url = new URL(FEED_URL);
  url.search = new URLSearchParams({
    employerId: EMPLOYER_ID,
    area: "113",
    host: "hh.ru",
    locale: "RU",
    perPage: String(FEED_PAGE_SIZE),
    page: String(page),
  }).toString();

  const response = await fetch(url, { signal, credentials: "omit" });
  if (!response.ok) throw new Error("Не удалось загрузить вакансии");

  const data: VacanciesPage = await response.json();
  if (!Array.isArray(data.items) || !Number.isSafeInteger(data.found) || !Number.isSafeInteger(data.pages)) {
    throw new Error("Неожиданный формат списка вакансий");
  }

  return {
    pages: data.pages,
    items: data.items.slice(0, FEED_PAGE_SIZE).filter((item) =>
      typeof item.name === "string" &&
      /^https:\/\/hh\.ru\/vacancy\/\d+(?:[?#]|$)/.test(item.alternateUrl),
    ),
  };
}

export async function loadVacancies(signal: AbortSignal) {
  const firstPage = await loadPage(0, signal);
  const otherPages = await Promise.all(
    Array.from({ length: Math.max(0, firstPage.pages - 1) }, (_, index) => loadPage(index + 1, signal)),
  );

  // Group the full feed before slicing it into the carousel's visible pages.
  const developers: Vacancy[] = [];
  const otherVacancies: Vacancy[] = [];
  const seen = new Set<string>();
  for (const { items } of [firstPage, ...otherPages]) {
    for (const vacancy of items) {
      if (seen.has(vacancy.id)) continue;
      seen.add(vacancy.id);
      const roles = vacancy.professionalRoles;
      const isDeveloper = Array.isArray(roles) && roles.some((role) => role?.id === DEVELOPER_ROLE_ID);
      (isDeveloper ? developers : otherVacancies).push(vacancy);
    }
  }
  return [...developers, ...otherVacancies];
}

export function vacancySummary(snippet: Vacancy["snippet"]) {
  const text = snippet?.responsibility?.trim() || snippet?.requirement?.trim();
  return text?.replace(/<\/?highlighttext>/gi, "");
}

export function vacancySalary(salary: Vacancy["salary"]) {
  if (!salary || !/^[A-Z]{3}$/.test(salary.currency)) return;

  const format = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: salary.currency === "RUR" ? "RUB" : salary.currency,
    maximumFractionDigits: 0,
  });
  const { from, to } = salary;

  if (from != null && to != null) {
    return from === to ? format.format(from) : format.formatRange(from, to);
  }
  if (from != null) return `от ${format.format(from)}`;
  if (to != null) return `до ${format.format(to)}`;
}
