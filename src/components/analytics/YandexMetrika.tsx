"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

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
 * Идентификатор держим здесь одной константой: он же нужен вызову `hit`.
 */
const COUNTER_ID = 109302007;

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
    ym(COUNTER_ID, "hit", window.location.href, {
      referer: document.referrer,
      title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export function YandexMetrika() {
  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){
   m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}', 'ym');
ym(${COUNTER_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});`}
      </Script>

      {/*
        useSearchParams требует Suspense-границы: без неё сборка переводит
        страницу в клиентский рендер целиком и статический экспорт ругается.
      */}
      <Suspense fallback={null}>
        <MetrikaHits />
      </Suspense>

      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${COUNTER_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}

export default YandexMetrika;
