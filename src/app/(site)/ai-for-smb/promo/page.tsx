import type { Metadata } from "next";

import FaqAccordion, { type FaqItem } from "@/components/interactive/FaqAccordion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { PROMO_TERMS_URL } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

/**
 * Предложение для малого бизнеса по предварительной редакции правил акции
 * «ИИ-команда в подарок» от 09.10.2026. Опубликованные правила акции доступны
 * по PROMO_TERMS_URL; ссылка на правила Банка пока не указана.
 */
export const metadata: Metadata = {
  ...pageMetadata({
    title: "ИИ-команда в подарок — акция для малого бизнеса | GigaCowork",
    description:
      "185 дней промо-доступа к GigaCowork со скидкой 100% для юридических лиц и ИП при выполнении условий акции в СберБизнес.",
    path: "/ai-for-smb/promo/",
  }),
  robots: { index: false, follow: true },
};

const BENEFITS = [
  { value: "185", unit: "дней", label: "промо-доступа с даты активации" },
  { value: "5", unit: "человек", label: "могут работать в сервисе" },
  { value: "10", unit: "коннекторов", label: "одновременно подключены" },
  { value: "150", unit: "ГБ", label: "объём хранилища" },
];

const STEPS = [
  {
    number: "01",
    title: "Выполните условие по РКО",
    text: "С 9 ноября по 31 декабря 2026 года подключите или используйте действующий платный тариф РКО «Бизнес Прайм», «Сбер Бизнес Прайм» либо другой пакет услуг стоимостью от 1 000 ₽ в месяц.",
  },
  {
    number: "02",
    title: "Перейдите из СберБизнес",
    text: "Откройте GigaCowork из соответствующего раздела СберБизнес. При переходе Банк передаст сведения о выполнении условия участия на основании вашего согласия.",
  },
  {
    number: "03",
    title: "Активируйте доступ",
    text: "Зарегистрируйтесь, примите оферту и правила акции, подтвердите согласие на электронный документооборот и активируйте промо-доступ до 20 января 2027 года включительно.",
  },
];

const FAQ: FaqItem[] = [
  {
    question: "Кто может участвовать?",
    answer: (
      <p>
        Юридические лица и индивидуальные предприниматели, зарегистрированные в
        России, с действующим доступом в СберБизнес, которые выполнили условие
        по РКО в акционный период и активировали доступ в установленный срок.
        Один промо-доступ предоставляется на один ИНН.
      </p>
    ),
  },
  {
    question: "Можно ли участвовать, если расчётный счёт в Сбере уже открыт?",
    answer: (
      <p>
        Да. Открывать новый счёт не требуется, если у вас уже есть расчётный
        счёт и действующий платный тариф РКО, соответствующий условиям акции.
      </p>
    ),
  },
  {
    question: "Кому промо-доступ не предоставляется?",
    answer: (
      <>
        <p>
          В акции не участвуют физические лица без статуса ИП, в том числе
          самозанятые без регистрации ИП, а также лица, указанные в пункте 4.6
          правил акции. В частности, это клиенты:
        </p>
        <ul className="list-disc space-y-8 pl-24">
          <li>с действующей подпиской или другим договором на использование GigaCowork;</li>
          <li>использовавшие пробный доступ в течение 12 месяцев до активации;</li>
          <li>с действующим договором на использование ПО в модели «Гибрид» или «ПАК»;</li>
          <li>ранее участвовавшие в акции или имеющие просроченную задолженность перед организатором.</li>
        </ul>
        <p>
          Также исключены отдельные взаимозависимые с Банком лица и резиденты
          офшорных зон из перечня Минфина России.
        </p>
      </>
    ),
  },
  {
    question: "Будет ли плата при превышении лимитов промо-тарифа?",
    answer: (
      <p>
        Нет. Превышение лимитов не создаёт обязанности оплатить сервис и не
        переводит вас автоматически на платный тариф.
      </p>
    ),
  },
  {
    question: "Что произойдёт после 185 дней?",
    answer: (
      <p>
        Промо-доступ прекратится без автоматического оформления платной
        подписки. Следующие 14 календарных дней учётная запись будет доступна
        только для чтения: данные можно просмотреть и выгрузить. После этого
        периода учётная запись и данные удаляются без возможности восстановления,
        если подписка не оформлена.
      </p>
    ),
  },
  {
    question: "Можно ли перейти на платный тариф?",
    answer: (
      <p>
        Да, в любой момент. Участникам акции доступен тариф «ГигаКоворк 10»
        до 10 пользователей за 125 000 ₽ в год без учёта НДС. Оформить его
        можно в течение промо-доступа и 14-дневного периода после его
        окончания. При оформлении подписки промо-доступ прекращается.
      </p>
    ),
  },
];

export default function SmbPromoPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-bg-page pt-[152px] pb-80 md:pt-[200px] md:pb-120">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(198.41deg,#d4e2ff_10.994%,#b3ebf6_79.923%,#b3f6e1_101.64%)]" />
        <Breadcrumbs items={[{ label: "ИИ-команда в подарок" }]} />
        <div className="container-page grid items-center gap-48 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col items-start gap-24">
            <Kicker>Акция для малого бизнеса</Kicker>
            <h1 className="max-w-[760px] text-h2 font-medium text-text-primary md:text-h1">
              ИИ-команда в подарок
            </h1>
            <p className="max-w-[670px] text-body-l text-text-primary">
              Получите 185 дней доступа к GigaCowork со скидкой 100% при
              выполнении условий акции по расчётно-кассовому обслуживанию
              в Сбере. Предложение для юридических лиц и ИП.
            </p>
            <div className="flex flex-wrap gap-12">
              <Button href="#how-to-join" size="lg">Как участвовать</Button>
              <Button
                href={PROMO_TERMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
              >
                Правила акции
              </Button>
            </div>
            <p className="max-w-[640px] text-body-m text-text-secondary">
              Условие по РКО нужно выполнить с 9 ноября по 31 декабря 2026 года.
              Активировать доступ — до 20 января 2027 года включительно.
            </p>
          </div>

          <div className="rounded-24 bg-bg-page p-24 shadow-[0_12px_48px_-8px_#60738f33] md:p-32">
            <p className="text-body-m text-text-secondary">Промо-доступ</p>
            <p className="mt-16 text-h1 font-medium text-text-primary">
              185 дней
            </p>
            <p className="mt-8 text-body-l text-text-secondary">
              Скидка 100% от стоимости промо-тарифа. Лицензионное вознаграждение
              за этот период не взимается.
            </p>
            <div className="mt-32 border-t border-border-subtle pt-24">
              <p className="text-body-m text-text-primary">
                Автоматического перехода на платный тариф нет
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg-page py-64 md:py-120">
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <div className="flex flex-col gap-16">
            <Kicker>Что входит</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              GigaCowork для вашей команды
            </h2>
            <p className="max-w-[740px] text-body-l text-text-secondary">
              Промо-тариф даёт доступ к облачной версии сервиса на 185
              календарных дней с даты активации.
            </p>
          </div>
          <ul className="grid gap-16 md:grid-cols-2 xl:grid-cols-4">
            {BENEFITS.map((item) => (
              <li
                key={item.value}
                className="rounded-24 bg-[linear-gradient(160deg,#f0f8ff_0%,#f7f7f8_100%)] p-24 md:p-32"
              >
                <p className="text-h2 font-medium text-text-primary">
                  {item.value} <span className="text-body-l">{item.unit}</span>
                </p>
                <p className="mt-16 text-body-m text-text-secondary">{item.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="conditions"
        className="scroll-mt-[calc(var(--header-h)+24px)] bg-[linear-gradient(198.41deg,#d4e2ff_10.994%,#b3ebf6_79.923%,#b3f6e1_101.64%)] py-64 md:py-120"
      >
        <div className="container-page grid gap-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-64">
          <div className="flex flex-col items-start gap-16">
            <Kicker>Условия участия</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Действующий платный тариф РКО
            </h2>
            <p className="text-body-l text-text-primary">
              Подойдёт «Бизнес Прайм», «Сбер Бизнес Прайм» или другой пакет
              услуг стоимостью от 1 000 ₽ в месяц. Если счёта в Сбере ещё нет,
              его нужно открыть в акционный период.
            </p>
          </div>
          <div className="rounded-24 bg-bg-page p-24 md:p-32">
            <h3 className="text-h4 font-medium text-text-primary">
              Проверьте перед активацией
            </h3>
            <ul className="mt-24 flex flex-col gap-16 text-body-l text-text-secondary">
              <li>Вы — юридическое лицо или ИП, зарегистрированные в России.</li>
              <li>У вас есть действующий доступ в СберБизнес.</li>
              <li>У вас нет действующей подписки на GigaCowork.</li>
              <li>Вы не использовали пробный доступ за последние 12 месяцев.</li>
            </ul>
            <p className="mt-24 text-body-m text-text-secondary">
              Соответствие условию по РКО проверяется на дату активации.
              Полный перечень ограничений указан в{" "}
              <a
                href={PROMO_TERMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-status-accent underline-offset-2 hover:underline"
              >
                правилах акции
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section
        id="how-to-join"
        className="scroll-mt-[calc(var(--header-h)+24px)] bg-bg-page py-64 md:py-120"
      >
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <div className="flex flex-col gap-16">
            <Kicker>Как получить доступ</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Три шага до начала работы
            </h2>
          </div>
          <ol className="grid gap-16 lg:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.number} className="rounded-24 border border-border-subtle p-24 md:p-32">
                <span className="text-h3 font-medium text-text-secondary">{step.number}</span>
                <h3 className="mt-24 text-h4 font-medium text-text-primary">{step.title}</h3>
                <p className="mt-16 text-body-m text-text-secondary">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-bg-page py-64 md:py-120">
        <div className="container-page flex flex-col gap-32 md:gap-48">
          <div className="flex flex-col gap-16">
            <Kicker>Вопросы и ответы</Kicker>
            <h2 className="text-h3 font-medium text-text-primary md:text-h2">
              Частые вопросы об акции
            </h2>
          </div>
          <FaqAccordion items={FAQ} />
          <p className="text-body-m text-text-secondary">
            По вопросам промо-доступа: <a className="underline underline-offset-4" href="mailto:support_cowork@gigab2b.ru">support_cowork@gigab2b.ru</a>.
            По условиям РКО обратитесь в Банк.
          </p>
        </div>
      </section>
    </>
  );
}
