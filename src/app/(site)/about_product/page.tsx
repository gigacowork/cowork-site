import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { asset } from "@/lib/asset";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "О продукте — ГигаЧат Бизнес",
    description:
      "Описание корпоративной ИИ-платформы ГигаЧат Бизнес и документы о продукте.",
    path: "/about_product/",
  }),
  robots: { index: false, follow: false },
};

const BENEFITS = [
  "Сотрудники тратят меньше времени на\u00A0рутину — больше на\u00A0задачи, которые требуют экспертизы",
  "Команды запускают проекты быстрее: меньше времени на\u00A0анализ, согласования и\u00A0документы",
  "Каждый специалист получает ИИ-агента, который помогает разобраться в\u00A0сложном и\u00A0найти ответ",
  "Руководитель видит, как ИИ внедряется в\u00A0компании, и\u00A0управляет процессом",
] as const;

const DOCUMENTS = [
  {
    title: "Описание жизненного цикла",
    file: "ГигаЧат Бизнес Описание жизненного цикла.docx",
  },
  {
    title: "Описание программного обеспечения",
    file: "ГигаЧат Бизнес Описание программного обеспечения.docx",
  },
  {
    title: "Порядок доступа к\u00A0тестовому экземпляру и\u00A0исходному коду",
    file: "ГигаЧат Бизнес Порядок доступа к тестовому экземпляру и исходному коду.docx",
  },
  {
    title: "Руководство администратора",
    file: "ГигаЧат Бизнес Руководство администратора.docx",
  },
  {
    title: "Руководство по\u00A0установке системы",
    file: "ГигаЧат Бизнес Руководство по установке системы.docx",
  },
  {
    title: "Руководство пользователя",
    file: "ГигаЧат Бизнес Руководство пользователя.docx",
  },
  {
    title: "Список технологий",
    file: "ГигаЧат Бизнес Список технологий.docx",
  },
  {
    title: "Техническая архитектура программного обеспечения",
    file: "ГигаЧат Бизнес Техническая архитектура программного обеспечения.docx",
  },
  {
    title: "Функциональные характеристики программного обеспечения",
    file: "ГигаЧат Бизнес Функциональные характеристики программного обеспечения.docx",
  },
  {
    title:
      "Технические средства хранения исходного текста и\u00A0объектного кода программного обеспечения",
    file: "ГигаЧат Бизнес Технические средства хранения исходного текста и объектного кода программного обеспечения.docx",
  },
  {
    title: "Стоимость поставок",
    file: "ГигаЧат для Бизнеса Стоимость поставок.pdf",
  },
] as const;

export default function AboutProductPage() {
  return (
    <>
      <section className="bg-[linear-gradient(59deg,#e8f5ff_0%,#e4f4ff_48%,#dbf7ec_100%)] pb-48 pt-[calc(var(--header-h)+24px)] md:pb-64 md:pt-[calc(var(--header-h)+32px)]">
        <div className="container-page">
          <Breadcrumbs items={[{ label: "О\u00A0продукте" }]} variant="inline" />
          <div className="max-w-[950px] pt-24 md:pt-40">
            <h1 className="text-[40px] font-medium leading-[1.2] tracking-[-0.02em] text-text-primary md:text-h1">
              О&nbsp;продукте
            </h1>
            <p className="mt-16 max-w-[820px] text-body-l text-text-secondary md:mt-24">
              ИИ-команда для&nbsp;вашего бизнеса
            </p>
          </div>
        </div>
      </section>

      <section
        id="product"
        aria-labelledby="product-title"
        className="scroll-mt-[var(--header-h)] bg-bg-page py-48 md:py-64"
      >
        <div className="container-page">
          <h2 id="product-title" className="text-h2 font-medium text-text-primary">
            ИИ-команда для&nbsp;вашего бизнеса
          </h2>
          <p className="mt-24 max-w-[900px] text-body-l text-text-secondary">
            Ускорит процессы, автоматизирует рутину, подскажет идеи. Работает
            в&nbsp;закрытом контуре компании, облаке или гибридном режиме.
          </p>

          <h3 className="mt-40 text-h3 font-medium text-text-primary md:mt-48">
            Как меняется работа в&nbsp;компании
          </h3>
          <ul className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
            {BENEFITS.map((benefit, index) => (
              <li
                key={benefit}
                className="flex items-start gap-16 rounded-24 bg-white p-16 text-body-m text-text-primary md:p-24"
              >
                <span className="flex size-32 shrink-0 items-center justify-center rounded-full bg-bg-card-lavender text-caption">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="docs"
        aria-labelledby="docs-title"
        className="scroll-mt-[var(--header-h)] bg-white py-64 md:py-96"
      >
        <div className="container-page">
          <h2 id="docs-title" className="text-h2 font-medium text-text-primary">
            Документы
          </h2>
          <ul className="mt-32 grid gap-12 md:mt-48 md:grid-cols-2 md:gap-16">
            {DOCUMENTS.map(({ title, file }) => {
              const isPdf = file.endsWith(".pdf");
              return (
                <li key={file}>
                  <a
                    className="group flex h-full items-center gap-16 rounded-24 border border-border-subtle bg-[#f7f8fa] p-24 text-body-l text-text-primary transition-colors hover:bg-bg-card-lavender focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary md:p-32"
                    href={asset(`/about_product/files/${file}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className={`flex size-48 shrink-0 flex-col items-center justify-center rounded-12 ${isPdf ? "bg-[#fff0ef] text-[#b84242]" : "bg-[#e8f1ff] text-[#3168a8]"}`}
                    >
                      <Icon src="/img/icons/document.svg" className="size-24" />
                      <span className="text-[9px] font-semibold leading-none">
                        {isPdf ? "PDF" : "DOCX"}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">ГигаЧат для&nbsp;Бизнеса: {title}</span>
                    <span aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-4">
                      ↗
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
