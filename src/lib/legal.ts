import { asset } from "@/lib/asset";

/**
 * Реквизиты компании — один источник для подвала сайта и подвала страницы
 * заявки. Раньше текст был написан в двух местах и разъехался: в подвале уже
 * стоял новый адрес, а на /lead оставался старый.
 *
 * Массив, а не одна строка: перенос между строками фиксирован и на десктопе
 * должен приходиться ровно сюда. Ниже md строки склеиваются и переносятся сами.
 */
export const LEGAL_LINES = [
  "© 2026 ООО «Салют для Бизнеса» 121170, г. Москва, Кутузовский пр-кт, д. 32,",
  "ИНН 7804568396, ОКВЭД 58.29, info@gigab2b.ru",
] as const;

/**
 * Правовые документы.
 *
 * Файлы лежат в public/legal и отдаются с самого сайта — раньше ссылки вели на
 * PDF соседнего проекта (gigacowork.github.io/gigaenterprise.ai), то есть на
 * чужие версии документов, обновить которые отсюда невозможно.
 *
 * Через `asset()`, потому что basePath ("/cowork-site" на GitHub Pages) сам
 * подставляется только в next/image и next/link, а это обычные <a href>.
 *
 * Адреса собраны здесь, а не в компонентах: одни и те же документы подписаны
 * под формой заявки, под формой «Опишите задачу» и в подвале.
 */
export const LEGAL_PDF = {
  /** Согласие на получение ознакомительных материалов о продуктах и сервисах */
  materials: asset(
    "/legal/soglasie_na_poluchenie_oznakomitelnykh_materialov_o_produktakh_servisakh.pdf"
  ),
  /** Согласие на обработку персональных данных */
  personal: asset("/legal/soglasie_na_obrabotku_personalnykh_dannykh.pdf"),
  /** Политика конфиденциальности */
  privacy: asset("/legal/politika_konfidentsialnosti.pdf"),
  /** Политика обработки персональных данных */
  dataPolicy: asset("/legal/politika_obrabotki_personalnykh_dannykh.pdf"),
} as const;
