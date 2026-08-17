import type { Metadata } from "next";
import Button from "@/components/ui/Button";

/**
 * «Документация» — /docs
 *
 * Пока заглушка: пункт в меню уже нужен, а содержимого нет. Страница
 * существует, чтобы ссылка из шапки не вела в 404; когда появится контент,
 * заменяется целиком.
 */

export const metadata: Metadata = {
  title: "Документация — GigaCowork",
  description:
    "Документация по платформе GigaCowork: руководства, справка по агентам, навыкам, командам и коннекторам.",
  robots: { index: false, follow: true },
};

/** Тот же фон, что у финального CTA главной (2572:11130). */
const HERO_GRADIENT =
  "bg-[linear-gradient(245.7deg,#f0f8ff_20.714%,#f7f7f8_94.867%)] " +
  "md:bg-[linear-gradient(227.36deg,#f0f8ff_20.714%,#f7f7f8_94.867%)]";

export default function DocsPage() {
  return (
    <section
      className={`flex w-full items-center pt-[calc(64px+var(--header-h))] pb-64 md:pt-[calc(80px+var(--header-h))] md:pb-96 ${HERO_GRADIENT}`}
    >
      <div className="container-page flex flex-col gap-24">
        <span className="w-fit rounded-full bg-bg-page/70 px-12 py-4 text-caption text-text-secondary">
          Скоро
        </span>
        <h1 className="text-h3 font-medium text-neutral-1000 md:text-h2">
          Документация
        </h1>
        <p className="max-w-[560px] text-body-l text-text-secondary">
          Готовим подробные руководства по агентам, навыкам, командам,
          пространствам и коннекторам. А пока разобраться с платформой помогут
          короткие видеоинструкции и описание последнего релиза.
        </p>
        <div className="flex flex-wrap gap-16">
          <Button
            href="/video"
            variant="primary"
            size="lg"
            className="text-body-m!"
          >
            Обучающие видео
          </Button>
          <Button
            href="/whats-new"
            variant="secondary"
            size="lg"
            className="text-body-m!"
          >
            Что нового
          </Button>
        </div>
      </div>
    </section>
  );
}
