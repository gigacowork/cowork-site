import type { MetadataRoute } from "next";
import { BASE_PATH } from "@/lib/asset";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt.
 *
 * Раньше файл лежал в public/ и был один на все окружения. Проблема в том, что
 * окружений два и правила у них противоположные:
 *
 *   • прод cowork.ru — открыт для обхода, закрыт только выставочный стенд;
 *   • технический стенд на GitHub Pages — закрыт целиком.
 *
 * Второе важнее, чем кажется: стенд отдаёт те же тексты, что и прод, и без
 * запрета поисковик индексирует обе копии. Дальше он сам решает, какая из них
 * главная, и решает не всегда в пользу боевого домена.
 *
 * Отличаем окружения по basePath: он непустой только на Pages, где сайт лежит
 * в подпапке. На проде переменная не задаётся — значит, домен свой.
 *
 * При статическом экспорте Next кладёт результат в out/robots.txt.
 */

const isStaging = BASE_PATH !== "";

/*
  При `output: "export"` Next требует явно объявить, что маршрут статический:
  robots.txt и sitemap.xml он по умолчанию считает динамическими и пытается
  считать их на сервере, которого в экспорте нет.
*/
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (isStaging) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /*
        Выставочный стенд для тач-панели: в навигации сайта его нет, в выдаче
        ему делать нечего. В самих страницах стоит ещё и meta robots
        noindex — robots.txt закрывает обход, meta закрывает выдачу.
      */
      disallow: "/landing-events",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
