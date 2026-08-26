import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { USE_CASES } from "@/lib/use-cases";
import { RELEASES } from "@/content/releases";

/**
 * Карта сайта.
 *
 * Собирается из тех же данных, что и сами маршруты, — списка ролей и списка
 * релизов. Так карта не разъезжается с сайтом: добавили роль, она появилась и
 * здесь, без отдельного списка, который кто-нибудь забудет обновить.
 *
 * Что в карту НЕ попадает:
 *   • `/landing-events/**` — выставочный стенд, закрыт `noindex` и в robots.txt;
 *   • `/ai-platform/docs/**` — выгрузка Antora со своей навигацией и сотнями
 *     страниц: в карте сайта ей делать нечего, поисковик дойдёт по ссылкам;
 *   • 404 — по определению.
 *
 * `trailingSlash: true` у проекта, поэтому все адреса со слэшем на конце: иначе
 * поисковик увидит редирект и посчитает адрес другим.
 *
 * При статическом экспорте Next кладёт результат в out/sitemap.xml.
 */

const url = (path: string) => `${SITE_URL}${path}`;

/*
  При `output: "export"` Next требует явно объявить, что маршрут статический:
  robots.txt и sitemap.xml он по умолчанию считает динамическими и пытается
  считать их на сервере, которого в экспорте нет.
*/
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  /*
    Дата берётся из данных релизов: самый свежий релиз задаёт дату изменения
    раздела «Что нового». Для остальных страниц конкретной даты правки у нас
    нет, и придумывать её — хуже, чем не указывать вовсе: поисковик доверяет
    lastModified и на выдуманной дате начинает ходить впустую.
  */
  const latestRelease = RELEASES[0]?.date;

  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/ai-platform/"), changeFrequency: "monthly", priority: 0.9 },
    {
      url: url("/ai-platform/new-features/"),
      changeFrequency: "monthly",
      priority: 0.7,
      ...(latestRelease ? { lastModified: new Date(latestRelease) } : {}),
    },
    ...RELEASES.map((release) => ({
      url: url(`/ai-platform/new-features/${release.slug}/`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
      ...(release.date ? { lastModified: new Date(release.date) } : {}),
    })),
    { url: url("/guides/"), changeFrequency: "monthly", priority: 0.7 },
    ...USE_CASES.map((useCase) => ({
      url: url(`/use_cases/${useCase.slug}/`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: url("/lead/"), changeFrequency: "yearly", priority: 0.4 },
  ];
}
