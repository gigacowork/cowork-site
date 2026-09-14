import type { Metadata } from "next";

import ExpertCarousel from "@/components/interactive/ExpertCarousel";
import Map2Gis from "@/components/interactive/Map2Gis";
import RevealCards from "@/components/interactive/RevealCards";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import { Kicker } from "@/components/ui/Kicker";
import { pageMetadata } from "@/lib/site";

/**
 * «О компании» — /company/about
 *
 * Макеты: desktop 4215:24059, mobile 4215:24260.
 * Секции сверху вниз:
 *   Hero       4215:24060 / 4215:24261
 *   Кто мы     4228:25579 / 4215:24270
 *   GigaCowork 4229:25764 / 4280:28644 — карточка с этапами и две инфо-карточки
 *   Команда    4231:28427 / 4215:24357 — карусель карточек с видео
 *   Сообщество 4262:83199 / 4308:28879
 *   Контакты   4270:22014 / 4308:28950 — реквизиты и карта 2ГИС
 *   CTA        4215:24258 / 4215:24369
 *
 * Ролики экспертов ещё не сняты — на их месте заглушка с кнопкой play и
 * подписью из макета. Появятся файлы — меняется только `ExpertVideo`.
 */

export const metadata: Metadata = pageMetadata({
  title: "О компании — GigaCowork",
  description:
    "«Салют для бизнеса» — аккредитованная российская ИТ-компания в группе Сбер, разработчик платформы GigaCowork для корпоративных ИИ-агентов. Команда, подход к внедрению и контакты московского офиса.",
  path: "/company/about/",
});

/* ──────────────────────────── градиенты из макета ──────────────────────── */

/** Фон секции «Кто мы» (4228:25579). */
const COMPANY_GRADIENT =
  "bg-[linear-gradient(200.01deg,#d4e2ff_0%,#b3ebf6_73.845%,#b3f6e1_97.115%)]";
/**
 * Заливка большой карточки «Берем ответственность за результат» (4254:24599).
 *
 * Угол и положение средней точки пересчитаны из матрицы градиента Figma: ручки
 * там уходят за пределы карточки, и на CSS-линии, которую браузер строит сам,
 * это даёт 55° со средним стопом на 48%.
 */
const COWORK_CARD_GRADIENT =
  "bg-[linear-gradient(55deg,#c5f8e5_0%,#caf5ff_48%,#cfedff_100%)]";

/**
 * Заливка карточки эксперта (4239:35084) — тот же градиент, что у большой
 * карточки выше: в макете это одна и та же заливка.
 */
const EXPERT_CARD_GRADIENT = COWORK_CARD_GRADIENT;

/**
 * Заливка инфо-карточек справа (4229:25778, 4229:25779).
 *
 * В макете это не один градиент, а три мягких цветных пятна поверх белой
 * подложки: голубое сверху справа, мятное снизу слева и сиреневое снизу
 * справа, каждое 30% прозрачности и с ядром до 34% радиуса. Держим их
 * отдельными слоями — свести в один градиент без потери картинки нельзя.
 * Порядок обратный фигмовскому: в CSS первый слой рисуется поверх остальных.
 */
const glow = (rgb: string, size: string, at: string) =>
  `radial-gradient(${size} at ${at}, rgba(${rgb},0.3) 0%, rgba(${rgb},0.3) 34%, rgba(${rgb},0) 100%)`;

const INFO_CARD_STYLE = {
  backgroundColor: "rgba(255,255,255,0.72)",
  backgroundImage: [
    glow("140,143,228", "80.6% 89.3%", "103.2% 94.6%"),
    glow("207,248,239", "108.7% 125%", "17.4% 100%"),
    glow("179,210,240", "108.7% 125%", "87% -42.5%"),
  ].join(", "),
};
/** Плашка MAX в блоке «Сообщество» (4283:24687). */
const MAX_GRADIENT = "bg-[linear-gradient(135deg,#7c4dff_0%,#3d6fff_100%)]";

/* ──────────────────────────────── данные ───────────────────────────────── */

/** Этапы в иллюстрации «Путь к результату» (4249:6468). */
const STAGES = [
  "Пилот",
  "Внедрение",
  "Масштабирование",
  /* Последняя отметка в макете выделена цветом — это цель, а не просто шаг. */
  { label: "Устойчивый результат", accent: true },
];

/** Две инфо-карточки справа от большой (4229:25778 / 25779). */
const INFO_CARDS = [
  {
    tag: { label: "Внутренний тест", icon: "/img/icons/flask-check.svg" },
    title: (
      <>
        Проверяем <br />
        на&nbsp;себе
      </>
    ),
    text: "Весь функционал сначала тестируется внутри компании на\u00A0реальных задачах.",
  },
  {
    tag: { label: "Совместное внедрение", icon: "/img/icons/puzzle-pair.svg" },
    title: (
      <>
        Работаем <br />
        вместе
      </>
    ),
    text: "Тесно взаимодействуем с\u00A0командой заказчика\u00A0– от\u00A0запуска до\u00A0масштабирования.",
  },
];

/** Карточки экспертов (4239:35084 / 35099 / 35114). */
const EXPERTS = [
  {
    name: "Павел Протопопов",
    role: "Менеджер продукта GigaCowork",
    quote:
      "AI для\u00A0бизнеса\u00A0— это не\u00A0эксперимент. Это наша основная специализация.",
  },
  {
    name: "Владислав Петров",
    role: "Архитектор AI-решений",
    quote:
      "Проектируем платформу так, чтобы агенты работали по\u00A0регламентам компании и\u00A0встраивались в\u00A0её ИТ-ландшафт.",
  },
  {
    name: "Екатерина Яковлева",
    role: "Эксперт по внедрению",
    quote:
      "Начинаем с\u00A0процессов, где агенты быстрее всего дают измеримый результат, а\u00A0затем масштабируем подход на\u00A0всю компанию.",
  },
];

/**
 * Каналы сообщества (4268:24729). Адреса появятся — подставляются в `href`.
 *
 * ВРЕМЕННО СКРЫТО: VK и MAX. Вернуть — снять у них `hidden`; сами записи
 * и логотипы в `public/img/about/social/` оставлены на месте.
 */
const SOCIALS = [
  {
    label: "Telegram",
    icon: "/img/about/social/telegram.svg",
    className: "bg-[#00acf1]",
    href: "https://t.me/+r9RKQYQnJ7JlMTli",
  },
  {
    label: "VK",
    icon: "/img/about/social/vk.svg",
    className: "bg-[#0079ff]",
    hidden: true,
  },
  {
    label: "MAX",
    icon: "/img/about/social/max.svg",
    className: MAX_GRADIENT,
    hidden: true,
  },
];

/** Реквизиты офиса (4275:24710). */
const CONTACTS = [
  { label: "Адрес", value: "Москва, Садовая-Самотёчная улица, 24/27" },
  { label: "Телефон", value: "8 800 505-80-53", href: "tel:+78005058053" },
  {
    label: "Электронная почта",
    value: "info@gigab2b.ru",
    href: "mailto:info@gigab2b.ru",
  },
  { label: "Режим работы", value: "9:00–18:00" },
];

/* ─────────────────────────── мелкие компоненты ─────────────────────────── */

/** Пилюля с иконкой — тег инфо-карточки (1383:8542). */
function Tag({ label, icon }: { label: string; icon: string }) {
  return (
    <span className="flex w-fit items-center gap-4 rounded-full bg-bg-tag py-8 pr-[10px] pl-8 text-caption text-text-primary">
      <Icon src={icon} className="size-[24px] text-icon-primary" />
      {label}
    </span>
  );
}

/**
 * Заглушка ролика на карточке эксперта (4237:15196).
 *
 * Роликов ещё нет, поэтому это не `video`, а статичный блок: кнопка play
 * нарисована, но ничего не запускает и из фокуса исключена — кликабельная
 * пустышка сбивала бы с толку.
 */
function ExpertVideo() {
  return (
    <div className="flex aspect-[524/320] w-full flex-col items-center justify-center gap-16 rounded-24 bg-bg-page p-32 shadow-[0_12px_48px_#60738f33]">
      <span
        aria-hidden
        className="flex size-[64px] items-center justify-center rounded-full border border-white/50 bg-bg-page"
      >
        <span className="flex size-[48px] items-center justify-center rounded-full bg-bg-page shadow-[0_12px_48px_#60738f33]">
          <Icon
            src="/img/icons/play.svg"
            className="size-[20px] text-icon-primary"
          />
        </span>
      </span>
      <span className="text-caption font-medium text-text-secondary">
        Видео с&nbsp;экспертом
      </span>
    </div>
  );
}

/* ─────────────────────────────── страница ──────────────────────────────── */

export default function AboutCompanyPage() {
  return (
    <>
      {/* ── Hero (4215:24060 / 4215:24261) ── */}
      <section className="relative isolate flex min-h-[588px] w-full flex-col justify-center overflow-hidden bg-bg-page pt-[152px] pb-[48px] md:min-h-[760px] md:pt-[272px] md:pb-96">
        <HeroImage
          desktop="/img/about/hero.webp"
          mobile="/img/about/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center gap-32 text-center md:items-start md:text-left">
          <div className="flex flex-col gap-16 md:gap-24">
            <h1 className="text-h2 font-medium text-text-primary md:text-h1">
              Строим платформу для&nbsp;корпоративного{" "}
              <br className="hidden md:inline" />
              использования ИИ
            </h1>
            <p className="text-body-l text-text-secondary">
              GigaCowork помогает создавать и&nbsp;управлять ИИ-агентами,{" "}
              <br className="hidden md:inline" />
              которые становятся частью рабочих процессов компании,{" "}
              <br className="hidden md:inline" />
              выполняя отдельные этапы или&nbsp;задачи целиком.
            </p>
          </div>
          <Button
            href="/lead"
            variant="primary"
            size="lg"
            className="w-[230px] text-body-m! md:w-auto"
          >
            Оставить заявку
          </Button>
        </div>
      </section>

      {/* ── Кто мы (4228:25579 / 4215:24270) ── */}
      <section className={`w-full py-64 md:py-120 ${COMPANY_GRADIENT}`}>
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <Kicker>Кто мы</Kicker>
          {/*
            В две колонки — только с lg. На планшете текстовая колонка 480 плюс
            картинка 523 в строку не помещались и распирали страницу вбок.
          */}
          <div className="flex flex-col gap-32 lg:flex-row lg:items-center lg:gap-80">
            <div className="flex flex-col gap-24 lg:w-[480px] lg:shrink-0">
              <h2 className="text-h3 font-medium text-text-primary md:text-h2">
                Салют для&nbsp;бизнеса
              </h2>
              <div className="flex flex-col gap-16 text-body-m text-text-secondary">
                <p>
                  Аккредитованная российская ИТ-компания, разработчик
                  и&nbsp;поставщик безопасных корпоративных ИИ-решений. Входим
                  в&nbsp;группу Сбер.
                </p>
                <p>
                  С&nbsp;момента запуска в&nbsp;2026 году наше решение уже
                  внедрили компании, которые являются лидерами в&nbsp;своих
                  сегментах.
                </p>
                <p>
                  Каждый день мы&nbsp;развиваем и&nbsp;улучшаем GigaCowork,
                  чтобы наши клиенты получали простые и&nbsp;современные
                  технологии для&nbsp;ускорения роста своего бизнеса.
                </p>
              </div>
            </div>
            <Image
              src="/img/about/sber.webp"
              alt=""
              width={523}
              height={478}
              /*
                Без `w-auto`: исходник 1047px шириной, и на планшете картинка
                в своём натуральном размере распирала страницу вбок. Здесь она
                тянется по месту, но не крупнее 523 из макета.
              */
              /*
                `min-w-0` — чтобы в строке картинка могла сжаться уже своей
                натуральной ширины (исходник 1047): без этого флекс-элемент
                не ужимается и вылезает за край.
              */
              className="w-full max-w-[523px] min-w-0 self-center object-contain"
            />
          </div>
        </div>
      </section>

      {/* ── GigaCowork (4229:25764 / 4280:28644) ── */}
      <section className="w-full bg-bg-page py-64 md:py-120">
        <div className="container-page">
          <RevealCards selector="article">
            {/*
              Слева одна высокая карточка, справа две по половине высоты —
              отсюда две равные строки и `row-span-2` у левой. Ниже lg всё
              складывается в одну колонку.
            */}
            <div className="grid gap-16 lg:grid-cols-[690fr_486fr] lg:grid-rows-2 lg:gap-24">
              {/* Большая карточка с иллюстрацией «Путь к результату» (4254:24599) */}
              <article
                className={`relative flex flex-col gap-40 overflow-hidden rounded-24 border border-white p-24 md:p-40 lg:row-span-2 lg:h-[532px] ${COWORK_CARD_GRADIENT}`}
              >
                <div className="flex flex-col gap-12 lg:max-w-[310px]">
                  <h3 className="text-h3 font-medium text-text-primary">
                    Берем ответственность за&nbsp;результат
                  </h3>
                  <p className="text-body-m text-text-primary">
                    Не&nbsp;останавливаемся на&nbsp;пилоте&nbsp;– работаем
                    с&nbsp;клиентом до&nbsp;устойчивого результата.
                  </p>
                </div>

                {/*
                  Illustration / Stages (4251:24676). От lg она выведена из
                  потока и правым краем уходит за карточку — та её обрезает.

                  Координаты сняты с эталонного рендера, а не из Figma напрямую:
                  в файле кадр стоит выше и левее и наезжает на последнюю строку
                  описания. Здесь он начинается там, где описание кончается.

                  По горизонтали — доли, а не пиксели макета (348 и 518 из 690).
                  Между lg и xl карточка уже 690, и от фиксированных пикселей
                  кадр обрезался до узкой полосы, где не помещались подписи
                  этапов. В долях срез остаётся таким же на любой ширине.

                  `scale` вместо правки размеров по отдельности: кадр ужимается
                  целиком — рамка, отступы, отметки и подписи в одной пропорции.
                  Точка отсчёта — левый верхний угол, поэтому `top` задан так,
                  чтобы низ кадра остался на прежнем месте.
                */}
                <div className="flex flex-col gap-32 rounded-[28px] border-[2.6px] border-brand-blue/22 bg-white/72 p-24 shadow-[0_3.45px_6.9px_rgba(0,0,0,0.05)] md:gap-40 md:p-40 lg:absolute lg:top-[203px] lg:left-[50.6%] lg:w-[75%] lg:origin-top-left lg:scale-[0.85] lg:gap-32 lg:p-[36px]">
                  <p className="text-body-l text-text-primary">
                    Путь к&nbsp;результату
                  </p>
                  <ol className="relative flex flex-col gap-32 md:gap-40">
                    {/* Линия между отметками — от центра первой до центра последней. */}
                    <span
                      aria-hidden
                      className="absolute top-[14px] bottom-[14px] left-[13px] w-[2px] bg-neutral-200"
                    />
                    {STAGES.map((stage) => {
                      const item =
                        typeof stage === "string"
                          ? { label: stage, accent: false }
                          : stage;
                      return (
                        <li
                          key={item.label}
                          className="relative flex items-center gap-12"
                        >
                          <span className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-brand-blue">
                            <Icon
                              src="/img/icons/check.svg"
                              className="size-[18px] text-icon-inverse"
                            />
                          </span>
                          <span
                            className={`text-body-m ${
                              item.accent
                                ? "text-status-accent"
                                : "text-text-primary"
                            }`}
                          >
                            {item.label}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </article>

              {/* Две инфо-карточки (4229:25778 / 25779) */}
              {INFO_CARDS.map((card) => (
                <article
                  key={card.tag.label}
                  style={INFO_CARD_STYLE}
                  className="flex flex-col gap-24 rounded-24 border border-white p-24 md:p-40 lg:col-start-2 lg:h-[254px]"
                >
                  {/*
                    От md заголовок слева, тег прижат к правому краю той же
                    строки — как в макете. На узком экране в строку они не
                    помещаются и подпись тега ломается на две, поэтому там тег
                    уходит на строку выше.
                  */}
                  <div className="flex flex-col-reverse items-start gap-16 md:flex-row md:justify-between">
                    <h3 className="text-h3 font-medium text-text-primary">
                      {card.title}
                    </h3>
                    <Tag label={card.tag.label} icon={card.tag.icon} />
                  </div>
                  <p className="text-body-m text-text-secondary">{card.text}</p>
                </article>
              ))}
            </div>
          </RevealCards>
        </div>
      </section>

      {/* ── Команда (4231:28427 / 4215:24357) ── */}
      <section className="w-full overflow-x-clip bg-bg-page py-64 md:pt-96 md:pb-120">
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <Kicker>Команда</Kicker>
          <div className="flex flex-col gap-16 md:max-w-[677px]">
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Познакомьтесь с&nbsp;командой GigaCowork
            </h2>
            <p className="text-body-m text-text-secondary">
              ML-инженеры, архитекторы, продакты, специалисты
              по&nbsp;информационной безопасности&nbsp;– все объединены
              стремлением создать лучший ИИ-продукт для&nbsp;бизнеса
              на&nbsp;российском рынке.
            </p>
          </div>

          <ExpertCarousel>
            <ul className="flex w-max gap-16 md:gap-24">
              {EXPERTS.map((expert) => (
                <li
                  key={expert.name}
                  className="w-[302px] shrink-0 snap-start md:w-[588px]"
                >
                  <article
                    className={`flex h-full flex-col gap-24 rounded-24 border border-neutral-200 p-24 shadow-[0_2px_4px_rgba(0,0,0,0.05)] md:h-[620px] md:p-32 ${EXPERT_CARD_GRADIENT}`}
                  >
                    <ExpertVideo />
                    {/*
                      Имя с должностью сверху, цитата прижата к низу карточки —
                      в макете у этого блока SPACE_BETWEEN и нижний отступ 24.
                    */}
                    <div className="flex flex-1 flex-col justify-between gap-16 pb-24">
                      <div className="flex flex-col gap-4">
                        <p className="text-h4 font-medium text-text-primary">
                          {expert.name}
                        </p>
                        <p className="text-caption text-text-secondary">
                          {expert.role}
                        </p>
                      </div>
                      <p className="text-body-m text-text-primary">
                        {expert.quote}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </ExpertCarousel>
        </div>
      </section>

      {/* ── Сообщество (4262:83199 / 4308:28879) ── */}
      <section className="w-full bg-bg-page py-64 md:py-48">
        <div className="container-page flex flex-col gap-16">
          <Kicker>Сообщество</Kicker>
          <h2 className="text-h3 font-medium text-text-primary md:text-h2">
            Подписывайтесь на&nbsp;GigaCowork
          </h2>
          {/*
            Пилюля с адресом — ссылка, без адреса — просто плашка: кнопка,
            ведущая в никуда, хуже отсутствующей.
          */}
          <ul className="flex flex-wrap gap-16 pt-24">
            {SOCIALS.filter((social) => !social.hidden).map((social) => {
              const pill = `flex items-center gap-4 rounded-full py-8 pr-16 pl-8 ${social.className}`;
              const inner = (
                <>
                  <Image
                    src={social.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="size-[24px]"
                  />
                  <span className="text-caption text-text-inverse">
                    {social.label}
                  </span>
                </>
              );
              return (
                <li key={social.label}>
                  {social.href ? (
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${social.label}\u00A0— канал GigaCowork`}
                      className={`${pill} transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <span className={pill}>{inner}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Контакты (4270:22014 / 4308:28950) ── */}
      <section className="w-full bg-bg-page py-64 md:py-96">
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <div className="flex flex-col gap-16">
            <Kicker>Контакты</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Свяжитесь с&nbsp;нами
            </h2>
          </div>

          <div className="grid gap-16 lg:grid-cols-[384fr_792fr] lg:gap-24">
            <div className="flex flex-col gap-24 rounded-24 bg-bg-glass p-24 md:p-32">
              <h3 className="text-h4 font-medium text-text-primary">
                Офис в&nbsp;Москве
              </h3>
              <dl className="flex flex-col gap-24">
                {CONTACTS.map((item) => (
                  <div key={item.label} className="flex flex-col gap-4">
                    <dt className="text-caption text-text-tertiary">
                      {item.label}
                    </dt>
                    <dd className="text-body-m text-text-primary">
                      {item.href ? (
                        <a
                          href={item.href}
                          className="transition-opacity hover:opacity-70"
                        >
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/*
              Подложка под картой видна, пока грузится виджет 2ГИС, и остаётся
              вместо него, если скрипт заблокирован у пользователя.
            */}
            <div className="relative h-[320px] overflow-hidden rounded-24 border border-border-subtle bg-bg-glass md:h-[420px]">
              <Map2Gis />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA (4215:24258 / 4215:24369) ── */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-160 ${CTA_FALLBACK}`}
      >
        <CtaBackground />
        <div className="container-page flex flex-col items-center gap-40">
          <h2 className="max-w-[522px] text-center text-h3 font-medium text-text-primary md:text-h2">
            Готовы делегировать <br className="hidden md:block" />
            работу ИИ-агентам?
          </h2>
          <Button
            href="/lead"
            variant="primary"
            size="lg"
            className="text-body-m!"
          >
            Попробовать бесплатно
          </Button>
        </div>
      </section>
    </>
  );
}
