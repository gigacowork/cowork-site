"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { BASE_PATH } from "@/lib/asset";

/**
 * Яндекс.Метрика.
 *
 * Счётчик вставлен так же, как в коде из личного кабинета: те же параметры
 * инициализации, тот же адрес tag.js, тот же <noscript> с пикселем. Отличия
 * два, оба вынужденные.
 *
 * 1. Сам сниппет подключается через next/script со стратегией afterInteractive,
 *    а не сырым <script> в разметке. React отдаёт содержимое <script> как
 *    текстовый узел и не выполняет его; next/script вставляет тег в документ
 *    после гидратации — счётчик срабатывает и не тормозит первую отрисовку.
 *
 * 2. Переходы внутри сайта отправляются вручную. Next ходит по страницам без
 *    перезагрузки, и Метрика видит только первый заход: скрипт tag.js
 *    отрабатывает один раз. Поэтому на смену адреса шлём `hit` сами — так
 *    считается каждая страница, а не только та, с которой начали.
 *
 * Оба счётчика получают просмотры страниц. Вебвизор остаётся только у
 * основного счётчика, как рекомендует Яндекс для нескольких счётчиков.
 */
const PRIMARY_COUNTER_ID = 109302007;
const ADDITIONAL_COUNTER_ID = 31643078;
const COUNTER_IDS = [PRIMARY_COUNTER_ID, ADDITIONAL_COUNTER_ID] as const;

// Цели из прометки отправляются только в основной счётчик. Для /skill/
// идентификатор строится по его адресу: в таблице там повторён /workspace/.
const MAIN_CTA_PATHS = new Set([
  "/ai-platform",
  "/ai-platform/workspace",
  "/ai-platform/agents",
  "/ai-platform/skill",
  "/ai-platform/connectors",
  "/ai-platform/quick-commands",
  "/ai-platform/schedule",
  "/use_cases/ceo",
  "/use_cases/finance",
  "/use_cases/salesforce",
  "/use_cases/procurement",
  "/use_cases/legal-team",
  "/use_cases/hr-team",
  "/use_cases/accounting",
  "/use_cases/it-support",
  "/trust-and-safety",
]);

function loader(counterId: number) {
  return `(function(m,e,t,r,i,k,a){
   m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${counterId}', 'ym');`;
}

function MetrikaHits() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  /*
    Первый просмотр отправляет сам init — второй раз слать его не нужно,
    иначе стартовая страница удваивается в отчётах.
  */
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const ym = (window as unknown as { ym?: (...args: unknown[]) => void }).ym;
    if (typeof ym !== "function") return;
    for (const counterId of COUNTER_IDS) {
      ym(counterId, "hit", window.location.href, {
        referer: document.referrer,
        title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

function MetrikaGoals() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("[data-metrica-goal]");
      const placement = element?.dataset.metricaGoal;
      if (!placement) return;

      const ym = (window as unknown as { ym?: (...args: unknown[]) => void }).ym;
      if (typeof ym !== "function") return;

      const rawPathname = window.location.pathname;
      const sitePathname = BASE_PATH && (rawPathname === BASE_PATH || rawPathname.startsWith(`${BASE_PATH}/`))
        ? rawPathname.slice(BASE_PATH.length) || "/"
        : rawPathname;
      const pathname = sitePathname.replace(/\/+$/, "") || "/";
      if (placement === "header-try") {
        ym(PRIMARY_COUNTER_ID, "reachGoal", "cowork.ru_click_button_Попробовать_header", {
          "cowork.ru": { click_button: { Попробовать_header: window.location.href } },
        });
      } else if (placement === "footer-try") {
        ym(PRIMARY_COUNTER_ID, "reachGoal", "cowork.ru_click_button_Попробовать_бесплатно_footer", {
          "cowork.ru": { click_button: { Попробовать_бесплатно_footer: window.location.href } },
        });
      } else if (placement === "home-platform" && pathname === "/") {
        ym(PRIMARY_COUNTER_ID, "reachGoal", "cowork.ru_click_button_О платформе", {
          "cowork.ru": { click_button: "О платформе" },
        });
      } else if (placement === "pricing-lead" && pathname === "/pricing") {
        ym(PRIMARY_COUNTER_ID, "reachGoal", "cowork.ru.pricing_click_button_Оставить заявку", {
          "cowork.ru.pricing": { click_button: "Оставить заявку" },
        });
      } else if (placement === "main-try" && MAIN_CTA_PATHS.has(pathname)) {
        const pageKey = `cowork.ru${pathname.replaceAll("/", ".")}`;
        ym(PRIMARY_COUNTER_ID, "reachGoal", `${pageKey}_click_button_Попробовать бесплатно_main`, {
          [pageKey]: { click_button: "Попробовать бесплатно_main" },
        });
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

export function YandexMetrika() {
  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`${loader(PRIMARY_COUNTER_ID)}
ym(${PRIMARY_COUNTER_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
${loader(ADDITIONAL_COUNTER_ID)}
ym(${ADDITIONAL_COUNTER_ID}, 'init', {ssr:true, clickmap:true, referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});`}
      </Script>

      {/*
        useSearchParams требует Suspense-границы: без неё сборка переводит
        страницу в клиентский рендер целиком и статический экспорт ругается.
      */}
      <Suspense fallback={null}>
        <MetrikaHits />
      </Suspense>
      <MetrikaGoals />

      <noscript>
        <div>
          {COUNTER_IDS.map((counterId) => (
            <img
              key={counterId}
              src={`https://mc.yandex.ru/watch/${counterId}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          ))}
        </div>
      </noscript>
    </>
  );
}

export default YandexMetrika;
