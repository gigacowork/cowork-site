import { Fragment } from "react";
import type { Metadata } from "next";

import FaqAccordion, {
  type FaqItem,
} from "@/components/interactive/FaqAccordion";
import RevealCards from "@/components/interactive/RevealCards";
import Button from "@/components/ui/Button";
import { CTA_FALLBACK, CtaBackground } from "@/components/ui/CtaBackground";
import { HeroImage } from "@/components/ui/HeroImage";
import { Icon } from "@/components/ui/Icon";
import { pageMetadata } from "@/lib/site";

/**
 * «Безопасность» — /trust-and-safety
 *
 * Макета нет: страница собрана по текстовому файлу «Безопасность.docx» в
 * стилистике остальных страниц сайта. Визуальный язык взят из блока
 * «Безопасность и контроль корпоративного уровня» на «Обзоре платформы»
 * (2888:17815): карточки с тегом-пилюлей и список правил с линией сверху.
 *
 * Кадр hero — дубль со страницы «Коннекторы».
 *
 * Заголовки и тексты — дословно из файла. В том числе то, что заголовок
 * «Разверните GigaCowork в своём контуре безопасности» стоит в нём дважды: у
 * второй секции и у блока с формой. Кикеров над заголовками нет — в файле их
 * тоже нет, а выдумывать подписи ради общего стиля сайта не стали.
 */

export const metadata: Metadata = pageMetadata({
  title: "Безопасность — GigaCowork",
  description:
    "Безопасность корпоративного ИИ GigaCowork: модели ГигаЧат в реестре ПО Минцифры, российские ОС, шифрование TLS, ролевая модель доступа, аудит действий и настраиваемые правила поведения модели.",
  path: "/trust-and-safety/",
});

/* ──────────────────────────────── градиенты ────────────────────────────── */

/** Фон секции с карточками — тот же, что у блока безопасности на /ai-platform. */
/**
 * Заливка карточек «Защита данных» — Gradient/Omni/Neuton_Light_3 под 60°,
 * тот же, что у карточек «ИИ-решение для всех подразделений».
 */
const PROTECTION_CARD_GRADIENT =
  "bg-[linear-gradient(59.96deg,#c5f8e5_0.95%,#dcf9ff_50.8%,#e4f5ff_101.64%)]";
const SECTION_GRADIENT =
  "bg-[linear-gradient(200.01deg,#d4e2ff_0%,#b3ebf6_73.845%,#b3f6e1_97.115%)]";

/* ──────────────────────────────── данные ───────────────────────────────── */

type TagCard = {
  tag: { label: string; icon: string };
  title: string;
  text: string;
};

/**
 * Карточки секции «Разверните GigaCowork в своём контуре безопасности».
 *
 * Подписи на пилюлях в файле не заданы — это единственное, что здесь добавлено
 * к тексту: без них карточка теряет узнаваемый вид остальных страниц.
 */
const FOUNDATION: TagCard[] = [
  {
    tag: { label: "Реестр ПО", icon: "/img/icons/double-headed-eagle.svg" },
    title: "Модели ГигаЧат в\u00A0реестре ПО Минцифры",
    text: "№20407 от\u00A014.12.2023",
  },
  {
    tag: { label: "Совместимость", icon: "/img/icons/component.svg" },
    title: "Российские ОС",
    text: "Совместимость с\u00A0СберЛинукс, АстраЛинукс",
  },
  {
    tag: { label: "Своя модель", icon: "/img/icons/bot.svg" },
    title: "Собственная нейросеть",
    text: "Нет санкционных рисков и\u00A0зависимости от\u00A0иностранного вендора",
  },
];

/**
 * «Защита данных и шифрование каналов» — четыре правила.
 *
 * В исходном файле каждое правило записано одной строкой — «название —
 * пояснение» со строчной буквы после тире. В карточке название становится
 * заголовком, пояснение — отдельным абзацем, поэтому оно с заглавной:
 * слова те же, меняется только первая буква.
 */
const PROTECTION: { title: string; text: string }[] = [
  {
    title: "Шифрование TLS",
    text: "Все данные передаются по\u00A0защищённому каналу",
  },
  {
    title: "Защита\nот\u00A0DDoS",
    text: "Система устойчива к\u00A0внешним сетевым атакам",
  },
  {
    title: "Ролевая модель доступа",
    text: "SSO с\u00A0Active Directory, сотрудники получают только нужный доступ",
  },
  {
    title: "Аудит и\u00A0мониторинг",
    text: "Все действия логируются",
  },
];

/** Карточки секции «Правила поведения модели и защита от утечек». */
const MODEL_RULES: TagCard[] = [
  {
    tag: { label: "Настройка", icon: "/img/icons/sliders.svg" },
    title: "Настраиваемое поведение",
    text: "Задайте запрещённые темы, обязательные дисклеймеры и\u00A0допустимый тон",
  },
  {
    tag: { label: "Приватность", icon: "/img/icons/shield-check.svg" },
    title: "Не\u00A0используем ваши данные",
    text: "Ваши данные не\u00A0используются для\u00A0обучения публичных версий моделей",
  },
  {
    tag: { label: "Доступ", icon: "/img/icons/key.svg" },
    title: "Защита коммерческой тайны",
    text: "Разграничение прав доступа к\u00A0чувствительной информации",
  },
];

/** «Часто задаваемые вопросы о безопасности» — пять пар из файла. */
const FAQ: FaqItem[] = [
  {
    question: "Обучаются ли модели на моих данных?",
    answer: (
      <p>
        Нет. Запросы пользователей и&nbsp;загруженные документы изолированы.
        Ваши данные не&nbsp;используются для&nbsp;дообучения базовых моделей.
      </p>
    ),
  },
  {
    question: "Какие данные передаются в облако при гибридном варианте?",
    answer: (
      <p>
        В облако передаются только данные, необходимые для&nbsp;обработки
        запроса и&nbsp;генерации ответа. Рабочие данные и&nbsp;документы
        компании остаются в&nbsp;вашем контуре. Облачный сегмент не&nbsp;хранит
        историю запросов после генерации ответа.
      </p>
    ),
  },
  {
    question: "Есть ли у вас сертификат ФСТЭК?",
    answer: (
      <p>
        Да. ООО&nbsp;«Салют для&nbsp;Бизнеса» обладает лицензиями ФСТЭК:
        на&nbsp;техническую защиту конфиденциальной информации
        (Л024-00107-00/00582499) и&nbsp;на&nbsp;разработку средств защиты
        (Л050-00107-00/00584112).
      </p>
    ),
  },
  {
    question: "Можно ли использовать GigaCowork в закрытом контуре?",
    answer: (
      <p>
        Да, для&nbsp;этого предусмотрен ПАК (On-premise). Позволяет развернуть
        платформу полностью автономно без&nbsp;доступа к&nbsp;интернету.
      </p>
    ),
  },
  {
    question: "Поддерживается ли интеграция с SIEM/DLP?",
    answer: (
      <p>
        Да, платформа предоставляет детальные логи событий, которые могут быть
        переданы в&nbsp;ваш SIEM/DLP.
      </p>
    ),
  },
];

/* ─────────────────────────── мелкие компоненты ─────────────────────────── */

/** Карточка с тегом-пилюлей — как в блоке безопасности на «Обзоре платформы». */
function Card({ card }: { card: TagCard }) {
  return (
    <article className="flex flex-col gap-16 rounded-[16px] bg-bg-page p-24 shadow-[0_12px_24px_rgba(96,115,143,0.2)] md:p-32">
      <span className="flex w-fit items-center gap-4 rounded-full bg-bg-card-lavender py-8 pr-[10px] pl-8 text-caption text-text-primary">
        <Icon src={card.tag.icon} className="size-[24px] text-icon-primary" />
        {card.tag.label}
      </span>
      <h3 className="text-h4 font-medium text-text-primary">{card.title}</h3>
      <p className="text-body-m text-text-primary">{card.text}</p>
    </article>
  );
}

/* ─────────────────────────────── страница ──────────────────────────────── */

export default function TrustAndSafetyPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative isolate flex min-h-[464px] w-full flex-col justify-center overflow-hidden bg-bg-page pt-[152px] pb-[80px] md:min-h-[760px] md:pt-[180px] md:pb-120">
        <HeroImage
          desktop="/img/trust-and-safety/hero.webp"
          mobile="/img/trust-and-safety/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="container-page flex flex-col items-center gap-32 text-center md:items-start md:gap-40 md:text-left">
          <div className="flex flex-col gap-16 md:max-w-[720px] md:gap-24">
            <h1 className="text-h2 font-medium text-text-primary md:text-h1">
              Безопасность корпоративного ИИ
            </h1>
            <p className="text-body-l text-text-secondary">
              Данные сотрудников и&nbsp;клиентов остаются под&nbsp;вашим
              контролем на&nbsp;каждом этапе. Настройте правила поведения модели
              под&nbsp;задачи вашей ИБ-службы.
            </p>
          </div>
          <Button
            href="/lead"
            variant="primary"
            size="lg"
            className="w-[230px] text-body-m! md:w-auto"
          >
            Попробовать бесплатно
          </Button>
        </div>
      </section>

      {/* ── Разверните GigaCowork в своём контуре безопасности ── */}
      <section className={`w-full py-48 md:py-[100px] ${SECTION_GRADIENT}`}>
        <div className="container-page flex flex-col gap-24 md:gap-[56px]">
          <header className="flex flex-col gap-16">
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Разверните GigaCowork <br className="hidden md:block" />в своём
              контуре безопасности
            </h2>
            <p className="text-body-l text-text-primary">
              GigaCowork разработан с&nbsp;опорой на&nbsp;лучшие мировые
              практики в&nbsp;области безопасности искусственного интеллекта.
            </p>
          </header>
          {/* Карточки выезжают по очереди при входе блока в кадр. */}
          <RevealCards selector="article">
            <div className="grid gap-24 md:grid-cols-3">
              {FOUNDATION.map((card) => (
                <Card key={card.title} card={card} />
              ))}
            </div>
          </RevealCards>
        </div>
      </section>

      {/* ── Защита данных и шифрование каналов ── */}
      <section className="w-full bg-bg-page py-48 md:py-[100px]">
        <div className="container-page flex flex-col gap-24 md:gap-[56px]">
          <header className="flex flex-col gap-16">
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Защита данных и&nbsp;шифрование каналов
            </h2>
            <p className="text-body-l text-text-secondary">
              Данные защищены на&nbsp;уровне передачи, доступа
              и&nbsp;мониторинга.
            </p>
          </header>
          {/*
            Карточки того же вида, что в «ИИ-решение для всех подразделений»
            на «Обзоре платформы» (2888:17841): тот же градиент, скругление 24
            и те же поля. Разница одна: там у карточки внизу теги и ссылка,
            поэтому ей нужны высота 291 и `justify-between`; здесь только заголовок
            с абзацем — карточки равняются по самой высокой в ряду, а жёсткий
            минимум оставлял бы полкарточки пустоты.
          */}
          <RevealCards selector="article">
            <div className="grid gap-24 sm:grid-cols-2 xl:grid-cols-4">
              {PROTECTION.map((rule) => (
                <article
                  key={rule.title}
                  className={`flex flex-col gap-16 rounded-[24px] px-24 pt-32 pb-24 md:px-40 md:pt-40 ${PROTECTION_CARD_GRADIENT}`}
                >
                  {/*
                    В заголовке перевод строки — жёсткий перенос. Тот же
                    приём, что в `title` карточек выгод и на страницах ролей:
                    текст остаётся обычной строкой, разметка живёт в данных.
                  */}
                  <h3 className="text-h4 font-medium text-text-primary md:text-h3">
                    {rule.title.split("\n").map((line, i) => (
                      <Fragment key={line}>
                        {i > 0 ? <br /> : null}
                        {line}
                      </Fragment>
                    ))}
                  </h3>
                  <p className="text-body-m text-text-secondary">{rule.text}</p>
                </article>
              ))}
            </div>
          </RevealCards>
        </div>
      </section>

      {/* ── Правила поведения модели и защита от утечек ── */}
      <section className={`w-full py-48 md:py-[100px] ${SECTION_GRADIENT}`}>
        <div className="container-page flex flex-col gap-24 md:gap-[56px]">
          <header className="flex flex-col gap-16">
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Правила поведения модели <br className="hidden md:block" />и
              защита от&nbsp;утечек
            </h2>
          </header>
          <RevealCards selector="article">
            <div className="grid gap-24 md:grid-cols-3">
              {MODEL_RULES.map((card) => (
                <Card key={card.title} card={card} />
              ))}
            </div>
          </RevealCards>
        </div>
      </section>

      {/* ── CTA с пробным доступом ── */}
      <section
        className={`relative isolate w-full overflow-hidden py-64 md:py-120 ${CTA_FALLBACK}`}
      >
        <CtaBackground variant="slab" />
        <div className="container-page flex flex-col items-center gap-40 text-center">
          <div className="flex max-w-[720px] flex-col gap-16">
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Разверните GigaCowork <br className="hidden md:block" />в своём
              контуре безопасности
            </h2>
          </div>

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

      {/* ── Часто задаваемые вопросы о безопасности ── */}
      <section className="w-full bg-bg-page py-64 md:py-80">
        {/*
          Блок целиком по центру колонки — заголовок и аккордеон (4127:77428:
          у секции выравнивание CENTER, заголовок с центровкой текста, лента
          вопросов шириной 992 посередине).
        */}
        <div className="container-page flex flex-col items-center gap-32">
          <h2 className="text-center text-h3 font-medium text-text-primary md:text-h1">
            Часто задаваемые вопросы <br className="hidden md:block" />о
            безопасности
          </h2>
          <div className="w-full lg:max-w-[992px]">
            <FaqAccordion items={FAQ} />
          </div>
        </div>
      </section>
    </>
  );
}
