"use client";

/**
 * Карта офиса — виджет 2ГИС на странице «О компании» (4274:24714).
 *
 * Виджет 2ГИС — старого образца: его загрузчик дописывает карту туда, где
 * выполнился сам скрипт (`document.currentScript.parentNode`). В React такого
 * места нет, поэтому весь сниппет живёт внутри `iframe` со своим документом:
 * там скрипт отрабатывает как на обычной странице, а стили и скрипты виджета
 * не смешиваются с нашими.
 *
 * `srcDoc` собирается один раз при рендере, размеры виджету передаются с
 * запасом — внутри iframe он растягивается на всю область.
 */

const ORG_ID = "70000001113325553";
const LAT = 55.77329;
const LON = 37.620204;

const SRC_DOC = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;height:100%;overflow:hidden}
.dg-widget-link{display:none}
#map,#map iframe{width:100%!important;height:100%!important;border:0!important}</style>
</head><body><div id="map">
<a class="dg-widget-link" href="http://2gis.ru/moscow/firm/${ORG_ID}/center/${LON},${LAT}/zoom/16">Посмотреть на карте Москвы</a>
<script charset="utf-8" src="https://widgets.2gis.com/js/DGWidgetLoader.js"><\/script>
<script charset="utf-8">new DGWidgetLoader({"width":"100%","height":"100%","borderColor":"#e6e9ed","pos":{"lat":${LAT},"lon":${LON},"zoom":16},"opt":{"city":"moscow"},"org":[{"id":"${ORG_ID}"}]});<\/script>
</div></body></html>`;

export function Map2Gis({ className = "" }: { className?: string }) {
  return (
    <iframe
      title="Офис «Салют для бизнеса» на карте 2ГИС"
      loading="lazy"
      srcDoc={SRC_DOC}
      className={`size-full border-0 ${className}`}
    />
  );
}

export default Map2Gis;
