import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import type { CaseStudy } from "@/content/cases";

/**
 * Карточка кейса в ленте `/success-stories`.
 *
 * Figma: Card / Case / Featured 5130:27311 (1200×480, кадр справа),
 *        Card / Case / Small     5130:27393 (588×480, без кадра),
 *        Card / Case / Mobile / Featured 5135:27437 (кадр сверху, 358×220).
 *
 * Раскладка в две колонки включается с lg, а не с md: при 768 колонка
 * выходит 344 px, а внутренняя вёрстка карточки рассчитана на 588 —
 * число 96 px и два чипа в ряд туда не помещаются.
 */

/** Заглушка вместо кадра — снимков для карточек пока нет (как на /media). */
function PhotoPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center rounded-16 bg-[linear-gradient(135deg,#e3ecf7_0%,#eef3f8_100%)] ${className}`}
    >
      <span className="text-caption text-text-tertiary">Фото</span>
    </div>
  );
}

/**
 * Чип отрасли/роли — Tag 1388:5966 с иконкой 24 в боксе с полями 8.
 * Иконка необязательна: под часть отраслей ассетов в проекте ещё нет,
 * и чип тогда рисуется одной подписью, а не с чужой картинкой.
 */
function Tag({ label, icon }: { label: string; icon?: string }) {
  return (
    <li
      className={`flex shrink-0 items-center justify-center gap-4 rounded-full bg-bg-tag py-8 ${
        icon ? "px-8" : "px-12"
      }`}
    >
      {icon ? (
        <Icon
          src={`/img/icons/${icon.toLowerCase()}.svg`}
          className="size-[24px] text-icon-primary"
        />
      ) : null}
      <span className="text-caption whitespace-nowrap text-text-primary">
        {label}
      </span>
    </li>
  );
}

/**
 * Слот логотипа фиксированной высоты 32 — логотипы разной высоты встают на
 * одну линию. Файла нет (versta.io) — в слоте название компании текстом.
 */
export function LogoSlot({ study }: { study: CaseStudy }) {
  return (
    <div className="flex h-[32px] shrink-0 items-center">
      {study.logo ? (
        <Image
          src={study.logo.src}
          alt={study.company}
          width={study.logo.width}
          height={study.logo.height}
          className={`${study.logo.className} max-h-[32px] w-auto object-contain object-left`}
        />
      ) : (
        <span className="text-h4 font-medium text-text-primary">
          {study.company}
        </span>
      )}
    </div>
  );
}

/** Круглая стрелка перехода — Pagination / Arrow 4562:15229, 48×48. */
function ArrowBadge() {
  return (
    <span
      aria-hidden
      className="flex size-[48px] shrink-0 items-center justify-center rounded-full border border-border-subtle bg-action-secondary-default"
    >
      <Icon
        src="/img/icons/arrow-next.svg"
        className="size-[20px] text-icon-primary"
      />
    </span>
  );
}

export function CaseCard({
  study,
  featured = false,
}: {
  study: CaseStudy;
  /** Широкая карточка с кадром — первая в ленте. */
  featured?: boolean;
}) {
  const href = study.slug ? `/success-stories/${study.slug}` : undefined;
  const text = study.cardDescription ?? study.description;

  return (
    /*
      Высота 480 из макета задана минимумом на самой карточке, а не высотой
      внутренней колонки: у flex-элемента `flex-basis` перебивает `height`,
      и колонка с `flex-1` просто игнорировала бы её — карточки сжимались
      по контенту вместо 480.
    */
    <article
      className={[
        "relative flex flex-col overflow-hidden rounded-24 lg:min-h-[480px]",
        featured ? "bg-[#f5f5f5] lg:col-span-2 lg:flex-row" : "bg-neutral-100",
        href ? "card-interactive" : "",
      ].join(" ")}
    >
      {featured ? (
        /* Кадр: сверху на телефоне (5132:15323), справа на десктопе (5119:15255) */
        <div className="order-first w-full lg:order-last lg:flex lg:w-[588px] lg:shrink-0 lg:items-center lg:py-24 lg:pr-24">
          {study.photo ? (
            <Image
              src={study.photo}
              alt=""
              width={564}
              height={432}
              className="h-[220px] w-full object-cover lg:h-[432px] lg:w-[564px] lg:rounded-16"
            />
          ) : (
            <PhotoPlaceholder className="h-[220px] w-full rounded-none lg:h-[432px] lg:w-[564px] lg:rounded-16" />
          )}
        </div>
      ) : null}

      {/* Card Content — 5119:15246 / 5126:15291 / 5132:15312 */}
      {/*
        Ширина 588 задаётся только у широкой карточки: у неё ряд строится
        по горизонтали, и `basis` читается как ширина. У узкой карточки
        колонка вертикальная — там тот же `basis` стал бы высотой и растянул
        карточку до 588.
      */}
      <div
        className={`flex flex-1 flex-col justify-between gap-24 p-24 lg:gap-0 lg:p-32 ${
          featured ? "lg:w-[588px] lg:shrink-0 lg:grow-0 lg:basis-[588px]" : ""
        }`}
      >
        {/* Result — 5125:15271 */}
        <div className="flex w-full flex-col gap-12">
          <p className="text-display-l font-normal text-text-primary">
            {study.metric}
          </p>
          <p className="text-body-l text-text-secondary">
            {study.metricCaption}
          </p>
        </div>

        {/* Logo — слот фиксированной высоты 32 */}
        <LogoSlot study={study} />

        <p className="text-body-l text-text-primary">{text}</p>

        {/* Tags + CTA — 5125:15287 */}
        <div className="flex items-center justify-between gap-16">
          <ul className="flex flex-wrap items-center gap-8">
            {study.tags.map((tag) => (
              <Tag key={tag.label} label={tag.label} icon={tag.icon} />
            ))}
          </ul>
          {/*
            Стрелка стоит только там, куда есть куда перейти: у двух кейсов
            из макета детальной страницы пока нет, и кликабельная на вид
            карточка без ссылки вводила бы в заблуждение.
          */}
          {href ? <ArrowBadge /> : null}
        </div>
      </div>

      {href ? (
        <Link
          href={href}
          aria-label={`Открыть кейс — ${study.company}`}
          className="absolute inset-0 z-10 focus-visible:outline-none"
        />
      ) : null}
    </article>
  );
}

export default CaseCard;
