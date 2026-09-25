/**
 * PartOfTeam — «Сделайте ИИ-агентов частью команды»
 * Figma desktop: 1927:15604 (1440 artboard, p-80, gap-64, content 1200 = 690 + 24 + 486)
 * Figma mobile:  1927:17410 (390 artboard, py-64 / px-16, gap-32, single column, gap-16)
 *
 * Все тексты взяты дословно из get_design_context обоих фреймов.
 * Мобильный и десктопный макеты расходятся в двух местах:
 *  - в левой карточке моб. версия показывает лого GigaCowork вместо заголовка
 *    «GigaCowork — единая среда» и не содержит стопку скриншотов приложения;
 *  - в правых карточках отличается текст описания (см. пары <p className="md:hidden"> / <p className="hidden md:block">).
 *
 * Hooks для анимации: [data-part-of-team], [data-app-preview-stack],
 * [data-app-preview] (+ data-depth="0|1|2", 2 — передний слой).
 */

import Link from "next/link";

import Image from "@/components/ui/Image";
import { Icon } from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

/* ------------------------------------------------------------------ */
/*  Заливки из Figma                                                    */
/* ------------------------------------------------------------------ */

/**
 * Фон секции — «BG Сделайте ИИ-агентов частью команды.png» (2160×1038 = 1.5×
 * десктопного фрейма 1927:15604). Это сведённая подложка целиком, поэтому она
 * заменяет прежнюю сборку из градиентов; базовый градиент остаётся под ней как
 * подложка на случай, если картинка не покрывает секцию по высоте.
 */
const SECTION_BASE =
  "bg-[linear-gradient(204.465deg,rgb(212,226,255)_10.474%,rgb(179,235,246)_94.872%)]";

/** Card / Cowork · ИИ-агенты GigaCowork — 1927:17413 (mobile) / 1927:15610 (desktop) */
const COWORK_CARD_GRADIENT =
  "bg-[linear-gradient(218.242deg,rgba(237,246,255,0.7)_10.474%,rgba(212,238,239,0.7)_94.872%)] " +
  "md:bg-[linear-gradient(223.036deg,rgb(212,226,255)_6.258%,rgb(247,254,255)_89.86%)]";

/** Card / Info — на десктопе три радиальных пятна (lavender / mint / blue) поверх white 70% */
const INFO_CARD_DESKTOP =
  "md:bg-[radial-gradient(80.6%_89.3%_at_103.2%_94.6%,rgba(140,143,228,0.3)_0%,rgba(140,143,228,0.3)_34%,rgba(140,143,228,0)_100%),radial-gradient(108.7%_125%_at_17.4%_100%,rgba(207,248,239,0.3)_0%,rgba(207,248,239,0.3)_34%,rgba(207,248,239,0)_100%),radial-gradient(108.7%_125%_at_87%_-42.5%,rgba(179,210,240,0.3)_0%,rgba(179,210,240,0.3)_34%,rgba(179,210,240,0)_100%),linear-gradient(rgba(255,255,255,0.7),rgba(255,255,255,0.7))]";

/*
  Card / Info 1312:4755 — по макету обе карточки кликабельны целиком
  (Default без тени → Hover Drop/Lg → Pressed Drop/Sm) и несут ссылку
  «Подробнее».

  Ссылки ведут на существующие разделы: «Три варианта поставки» — на страницу
  поставок, «Обучение и сопровождение» — на обучающие видео. Пока этих страниц
  не было, ссылка и наведение были сняты; теперь карточки снова кликабельны
  целиком — зону клика растягивает `stretched-target` внутри `card-interactive`.
*/
const INFO_CARD_BASE =
  "card-interactive relative flex min-h-[254px] flex-col justify-between gap-40 overflow-hidden rounded-[24px] " +
  "border border-[rgba(255,255,255,0.5)] p-40 " +
  INFO_CARD_DESKTOP;

/* ------------------------------------------------------------------ */
/*  Данные                                                              */
/* ------------------------------------------------------------------ */

/** Chips — I1927:15610;788:4084 */
const CHIPS = [
  "Рабочие пространства",
  "ИИ-агенты без\u00A0кода",
  "Навыки агентов",
  "Запуск по\u00A0расписанию",
  "MCP-интеграции",
];

/** Illustration / Suppies — I1927:15612;1246:4299 (только десктоп) */
const SUPPLY_TAGS = [
  { label: "Облако", icon: "/img/team/icon-cloud.svg" },
  { label: "Гибрид", icon: "/img/team/icon-component.svg" },
  { label: "ПАК", icon: "/img/team/icon-model.svg" },
];

/**
 * Card / Cowork / App Preview ×3 — 3284:73413 (I…;1078:3397 / ;1410:17350 /
 * ;1410:15527).
 *
 * В макете это три экземпляра одного и того же экрана приложения: различаются
 * только положением и прозрачностью (60 / 40 / 100 %). Поэтому в проекте один
 * файл, а не три картинки: `app-preview.webp` — видимая часть переднего слоя,
 * обрезанная по правому и нижнему краю карточки (293×364 в единицах макета,
 * экспорт 2×). Прозрачность и сдвиг задней пары делает CSS.
 *
 * Позиционирование — от правого нижнего угла карточки: картинка вылезает за её
 * край, как в макете, и остаётся прижатой к углу, какой бы высоты карточка ни
 * оказалась (на 768–1023 она выше макетных 532 — её тянет соседняя колонка).
 *
 * Сдвиги заданы в процентах от самой картинки, а не карточки: так пара за
 * передним слоем едет вместе с ним при любой ширине. В единицах макета это
 * +23 / −14 и +48 / −25 — разница координат слоёв (420−397, 168−154 и
 * 445−397, 168−143).
 */
const PREVIEW_SRC = "/img/team/app-preview.webp";
const PREVIEW_W = 586;
const PREVIEW_H = 728;
/** Ширина в процентах от карточки: 293 из 690 макетных. */
const PREVIEW_WIDTH = "42.4638%";

const APP_PREVIEWS = [
  // x=445 y=143 — самый дальний слой
  { key: "far", opacity: 0.4, shift: "translate(16.3823%, -6.8681%)" },
  // x=420 y=154 — средний слой
  { key: "mid", opacity: 0.6, shift: "translate(7.8498%, -3.8462%)" },
  // x=397 y=168 — передний слой, по нему обрезана картинка
  { key: "front", opacity: 1, shift: "none" },
];

/* ------------------------------------------------------------------ */

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center justify-center gap-4 rounded-full bg-bg-tag py-8 pl-12 pr-[14px] text-caption text-text-primary">
      {children}
    </li>
  );
}

/**
 * Text Link 1003:4161. Растягивает свою зону клика на всю карточку, поэтому
 * кликабельна карточка целиком, а разметка остаётся валидной и доступной.
 */
function MoreLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="text-link stretched-target flex w-fit cursor-pointer items-center justify-center py-4 text-caption focus-visible:outline-none"
    >
      Подробнее
    </Link>
  );
}

export function PartOfTeam() {
  return (
    <section
      id="giga-cowork"
      data-part-of-team
      aria-labelledby="part-of-team-title"
      className={`relative isolate overflow-hidden ${SECTION_BASE}`}
    >
      <Image
        src="/img/team/section-bg.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="pointer-events-none -z-10 object-cover [object-position:left_top] md:[object-position:center]"
      />

      <div className="container-page flex flex-col items-start gap-32 py-64 md:items-center md:gap-64 md:py-80">
        {/* 1927:15605 / 1927:17411 */}
        <h2
          id="part-of-team-title"
          className="text-h3 font-medium text-neutral-1000 md:text-center md:text-h2"
        >
          Сделайте ИИ-агентов
          <br />
          частью команды
        </h2>

        {/* GigaCowork / Content — 1927:15606 / 1927:17412 */}
        <div className="flex w-full flex-col gap-16 md:flex-row md:items-stretch md:gap-24">
          {/* Card / Cowork · ИИ-агенты GigaCowork */}
          <article
            className={`relative flex flex-col overflow-hidden rounded-[24px] p-24 md:min-h-[532px] md:border md:border-[rgba(255,255,255,0.5)] md:p-40 md:flex-[690_1_0px] ${COWORK_CARD_GRADIENT}`}
          >
            <div className="relative z-10 flex flex-col gap-24 md:w-[51%] md:gap-96">
              {/* Intro — I1927:15610;788:4080 */}
              <div className="flex flex-col gap-24 md:gap-12">
                {/* Brand / Logo — I1927:17413;788:4115 (только мобильный макет) */}
                <Image
                  src="/img/logo-gigacowork.svg"
                  alt="GigaCowork"
                  width={173}
                  height={37}
                  className="md:hidden"
                />
                <h3 className="hidden text-h3 font-medium text-text-primary md:block">
                  GigaCowork —
                  <br />
                  единая среда
                </h3>
                <p className="text-body-l text-text-primary">
                  где агенты и&nbsp;сотрудники работают вместе
                  с&nbsp;документами, базами знаний и&nbsp;данными
                  из&nbsp;корпоративных систем
                </p>
              </div>

              {/* Actions — I1927:15610;788:4083 */}
              <div className="flex flex-col gap-24">
                <ul className="flex flex-wrap content-start items-center gap-8">
                  {CHIPS.map((chip) => (
                    <Tag key={chip}>{chip}</Tag>
                  ))}
                </ul>
                <Button
                  href="/ai-platform"
                  variant="primary"
                  size="md"
                  className="w-[160px] py-12!"
                >
                  О&nbsp;платформе
                </Button>
              </div>
            </div>

            {/* Стопка скриншотов приложения — только десктоп */}
            <div
              aria-hidden
              data-app-preview-stack
              className="pointer-events-none absolute inset-0 hidden md:block"
            >
              {APP_PREVIEWS.map((preview, index) => (
                <Image
                  key={preview.key}
                  data-app-preview
                  data-depth={index}
                  src={PREVIEW_SRC}
                  alt=""
                  width={PREVIEW_W}
                  height={PREVIEW_H}
                  style={{
                    width: PREVIEW_WIDTH,
                    opacity: preview.opacity,
                    transform: preview.shift,
                  }}
                  className="absolute right-0 bottom-0 h-auto max-w-none"
                />
              ))}
            </div>
          </article>

          {/* GigaCowork / Right Column — 1927:15611 / 1927:17414 */}
          <div className="flex flex-col gap-16 md:gap-24 md:flex-[486_1_0px]">
            {/* Card / Info · Три варианта поставки — 1927:15612 / 1927:17415 */}
            <article
              className={`${INFO_CARD_BASE} bg-[linear-gradient(246.301deg,rgb(240,248,255)_20.714%,rgb(247,247,248)_94.867%)]`}
            >
              <div className="flex flex-col gap-16">
                <h3 className="text-h3 font-medium text-text-primary">
                  Три варианта
                  <br />
                  поставки
                </h3>
                <p className="text-body-l text-text-secondary md:hidden">
                  Облако, Гибрид и&nbsp;ПАК.
                  <br />
                  Подберём под&nbsp;требования ИБ
                  <br />
                  и&nbsp;вашей бизнес-потребности
                </p>
                <p className="hidden text-body-l text-text-secondary md:block">
                  Подберём под&nbsp;требования ИБ
                  <br />
                  и&nbsp;вашей бизнес-потребности
                </p>
              </div>

              {/* Illustration / Suppies — I1927:15612;1246:4299, отсутствует в мобильном макете */}
              <ul className="absolute top-[39px] right-[42px] hidden w-[99px] flex-col items-end gap-12 md:flex">
                {SUPPLY_TAGS.map(({ label, icon }) => (
                  /*
                    Ширина у всех трёх чипов общая (99 из макета), а подписи
                    разной длины. При `justify-center` содержимое каждого чипа
                    вставало по своему центру, и иконки шли лесенкой. Прижимаем
                    к левому краю — иконки выстраиваются в одну вертикаль.
                  */
                  <li
                    key={label}
                    className="flex w-full items-center justify-start gap-4 rounded-full bg-bg-tag py-8 pl-12 pr-[14px] text-caption text-text-primary"
                  >
                    {/* Icon frame 354:151 — cloud / component / model, 24×24 */}
                    <Icon
                      src={icon}
                      className="size-[24px] text-icon-primary"
                    />
                    {label}
                  </li>
                ))}
              </ul>

              <MoreLink
                href="/pricing"
                label="Подробнее о трёх вариантах поставки"
              />
            </article>

            {/* Card / Info · Обучение и сопровождение — 1927:15613 / 1927:17416 */}
            <article
              className={`${INFO_CARD_BASE} bg-[linear-gradient(250.394deg,rgb(240,248,255)_20.714%,rgb(247,247,248)_94.867%)]`}
            >
              <div className="flex flex-col gap-16">
                <h3 className="text-h3 font-medium text-text-primary">
                  Обучение
                  <br />
                  и&nbsp;сопровождение
                </h3>
                <p className="text-body-l text-text-secondary md:hidden">
                  Онлайн база знаний.
                  <br />
                  Консалтинг и&nbsp;экспертное сопровождение на&nbsp;всех этапах
                  внедрения. Корпоративные курсы по&nbsp;ГенИИ
                  в&nbsp;СберУниверситете
                </p>
                <p className="hidden text-body-l text-text-secondary md:block">
                  База знаний, консалтинг и&nbsp;сопровождение внедрения.
                  Корпоративные курсы по&nbsp;ГенИИ
                  <br />
                  в&nbsp;СберУниверситете
                </p>
              </div>

              {/*
                Ведёт на «Академию»: с 25.09.2026 обучающие ролики вошли в неё
                первым блоком, и это теперь единственный раздел про обучение
                в навигации сайта.
              */}
              <MoreLink
                href="/ai-academy"
                label="Подробнее об обучении и сопровождении"
              />
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PartOfTeam;
