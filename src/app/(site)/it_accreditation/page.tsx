import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Kicker } from "@/components/ui/Kicker";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "ИТ-аккредитация — GigaCowork",
  description:
    "Сведения об ООО «Салют для Бизнеса»: организация, программное обеспечение, ориентировочная стоимость и разработка.",
  path: "/it_accreditation/",
});

const SECTIONS = [
  { id: "org", label: "Организация" },
  { id: "software", label: "Программное обеспечение" },
  { id: "price", label: "Стоимость" },
  { id: "dev", label: "Разработка" },
] as const;

function SectionHeading({
  number,
  title,
  id,
}: {
  number: string;
  title: string;
  id: string;
}) {
  return (
    <div className="flex items-start gap-16 md:items-center md:gap-24">
      <span className="flex size-40 shrink-0 items-center justify-center rounded-full bg-bg-card-lavender text-body-m text-text-primary md:size-48">
        {number}
      </span>
      <h2 id={id} className="text-h2 font-medium text-text-primary">
        {title}
      </h2>
    </div>
  );
}

function DetailCard({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-12 rounded-24 bg-[#f7f8fa] p-24 md:p-32 ${wide ? "md:col-span-2" : ""}`}
    >
      <dt className="text-body-m text-text-secondary">{label}</dt>
      <dd className="break-words text-body-l text-text-primary">{children}</dd>
    </div>
  );
}

export default function ItAccreditationPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(59deg,#e8f5ff_0%,#e4f4ff_48%,#dbf7ec_100%)] pb-64 pt-[calc(var(--header-h)+32px)] md:pb-80 md:pt-[calc(var(--header-h)+48px)]">
        <div className="container-page">
          <Breadcrumbs items={[{ label: "ИТ-аккредитация" }]} variant="inline" />
          <div className="flex max-w-[900px] flex-col gap-16 pt-32 md:gap-24 md:pt-64">
            <Kicker>ООО «Салют для Бизнеса»</Kicker>
            <h1 className="text-[40px] leading-[1.2] tracking-[-0.02em] font-medium text-text-primary md:text-h1">
              ИТ-аккредитация
            </h1>
            <p className="max-w-[720px] text-body-l text-text-secondary">
              Сведения об организации, программном обеспечении, стоимости и
              разработке.
            </p>
          </div>
          <nav
            aria-label="Разделы страницы"
            className="mt-48 flex flex-wrap gap-8 md:mt-64 md:gap-12"
          >
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-border-subtle bg-white px-16 py-12 text-body-m text-text-primary transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <>
        <section
          id="org"
          aria-labelledby="org-title"
          className="scroll-mt-[var(--header-h)] bg-bg-page py-64 md:py-96"
        >
          <div className="container-page flex flex-col gap-32 md:gap-48">
            <SectionHeading number="01" title="Сведения об организации" id="org-title" />
            <div className="rounded-24 bg-[linear-gradient(59.96deg,#c5f8e5_0.95%,#dcf9ff_50.8%,#e4f5ff_101.64%)] p-24 md:p-40">
              <h3 className="text-h3 font-medium text-text-primary">
                ООО «Салют для Бизнеса»
              </h3>
              <p className="mt-16 max-w-[940px] text-body-l text-text-primary">
                Общество с ограниченной ответственностью «Салют для Бизнеса»
                разрабатывает и развивает корпоративную ИИ-платформу ГигаЧат
                Бизнес на основе собственной нейросетевой модели.
              </p>
            </div>
            <dl className="grid gap-16 md:grid-cols-2 md:gap-24">
              <DetailCard label="ИНН">7804568396</DetailCard>
              <DetailCard label="Юридический адрес">
                121170, г. Москва, Кутузовский пр-кт, д. 32
              </DetailCard>
              <DetailCard label="Контакты">
                <a className="text-link" href="mailto:info@gigab2b.ru">
                  info@gigab2b.ru
                </a>
                ,{" "}
                <a className="text-link" href="tel:+78005058053">
                  +7 800 505-80-53
                </a>
              </DetailCard>
              <DetailCard label="Основной ОКВЭД">
                58.29 — Издание прочих программных продуктов
              </DetailCard>
              <DetailCard
                label="Вид деятельности в соответствии с приказом Минцифры от 11 мая 2023 г. № 449"
                wide
              >
                1.01, 2.01, 27.01
              </DetailCard>
            </dl>
          </div>
        </section>

        <section
          id="software"
          aria-labelledby="software-title"
          className="scroll-mt-[var(--header-h)] bg-white py-64 md:py-96"
        >
          <div className="container-page flex flex-col gap-32 md:gap-48">
            <SectionHeading number="02" title="Программное обеспечение" id="software-title" />
            <div className="flex max-w-[940px] flex-col gap-16 text-body-l text-text-secondary">
              <p>
                ПО «ГигаЧат для бизнеса» — собственная разработка ООО «Салют
                для Бизнеса».
              </p>
              <p>
                Информация об исключительных правах на разработанные
                организацией программы для ЭВМ, базы данных, включении в Реестр
                российского ПО, способах предоставления права использования
                указанных программ:
              </p>
            </div>
            <dl className="grid gap-16 md:grid-cols-2 md:gap-24">
              <DetailCard label="Программа">ГигаЧат для Бизнеса</DetailCard>
              <DetailCard label="Правообладатель">
                ООО «Салют для Бизнеса»
              </DetailCard>
              <DetailCard label="Регистрационный номер в Реестре российского ПО">
                —
              </DetailCard>
              <DetailCard label="Способы предоставления права использования">
                Лицензия
              </DetailCard>
            </dl>
          </div>
        </section>

        <section
          id="price"
          aria-labelledby="price-title"
          className="scroll-mt-[var(--header-h)] bg-bg-page py-64 md:py-96"
        >
          <div className="container-page flex flex-col gap-32 md:gap-48">
            <SectionHeading number="03" title="Стоимость" id="price-title" />
            <div className="flex flex-col gap-16">
              <p className="text-body-l text-text-secondary">
                Ориентировочная стоимость продукта:
              </p>
              <ul className="grid gap-16 md:grid-cols-3 md:gap-24">
                <li className="flex flex-col gap-24 rounded-24 bg-[linear-gradient(232.657deg,#f0f8ff_20.714%,#f7f7f8_94.867%)] p-24 md:min-h-[220px] md:p-32">
                  <span className="w-fit rounded-full bg-bg-card-lavender px-12 py-8 text-caption text-text-primary">
                    Облако · пакет XS
                  </span>
                  <div className="flex flex-col gap-8">
                    <h3 className="text-h4 font-medium text-text-primary">
                      ГигаЧат для Бизнеса
                    </h3>
                    <p className="text-body-l text-text-primary">
                      от 2,5 млн рублей в год
                    </p>
                  </div>
                </li>
                <li className="flex flex-col gap-24 rounded-24 bg-[linear-gradient(232.657deg,#f0f8ff_20.714%,#f7f7f8_94.867%)] p-24 md:min-h-[220px] md:p-32">
                  <span className="w-fit rounded-full bg-bg-card-lavender px-12 py-8 text-caption text-text-primary">
                    Гибрид · пакет M
                  </span>
                  <div className="flex flex-col gap-8">
                    <h3 className="text-h4 font-medium text-text-primary">
                      ГигаЧат для Бизнеса
                    </h3>
                    <p className="text-body-l text-text-primary">
                      от 15 млн рублей в год
                    </p>
                  </div>
                </li>
                <li className="flex flex-col gap-24 rounded-24 bg-[linear-gradient(232.657deg,#f0f8ff_20.714%,#f7f7f8_94.867%)] p-24 md:min-h-[220px] md:p-32">
                  <span className="w-fit rounded-full bg-bg-card-lavender px-12 py-8 text-caption text-text-primary">
                    ПАК · 8 карт H200
                  </span>
                  <div className="flex flex-col gap-8">
                    <h3 className="text-h4 font-medium text-text-primary">
                      ГигаЧат для Бизнеса
                    </h3>
                    <p className="text-body-l text-text-primary">
                      от 67 млн рублей в год
                    </p>
                  </div>
                </li>
              </ul>
              <p className="mt-8 max-w-[940px] text-body-l text-text-secondary">
                Конкретная стоимость продукта рассчитывается индивидуально для
                каждого клиента. Приведенные значения носят ориентировочный
                характер. Для уточнения стоимости вы можете связаться с нами по
                адресу{" "}
                <a className="text-link" href="mailto:info@gigab2b.ru">
                  info@gigab2b.ru
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section
          id="dev"
          aria-labelledby="dev-title"
          className="scroll-mt-[var(--header-h)] bg-white py-64 md:py-96"
        >
          <div className="container-page flex flex-col gap-32 md:gap-48">
            <SectionHeading number="04" title="Разработка" id="dev-title" />
            <div className="flex max-w-[940px] flex-col gap-24 text-body-l text-text-primary">
              <p className="font-medium">
                Языки программирования, ПО или наборы правил и инструментов,
                которые используются для разработки ПО или построения процессов
                в программировании:
              </p>
              <div className="grid gap-16 md:grid-cols-3 md:gap-24">
                <p className="rounded-24 bg-[#f7f8fa] p-24 md:p-32">
                  Разработка ведется с использованием внутренних регламентов
                  организации производства программного обеспечения.
                </p>
                <p className="rounded-24 bg-[#f7f8fa] p-24 md:p-32">
                  Программные продукты создаются с использованием внутренней
                  платформы хранения и развертывания ПО — GitLab.
                </p>
                <p className="rounded-24 bg-[#f7f8fa] p-24 md:p-32">
                  Команды разработки используют для написания исходного кода
                  различные языки программирования. Основные: Python, Golang,
                  JavaScript.
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    </>
  );
}
