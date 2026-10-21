import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PROMO_TERMS_URL } from "@/lib/legal";

/** Баннер акции на главной — Figma 6075:73336. */
export function PromoBanner({ lesson = false }: { lesson?: boolean }) {
  return (
    <aside
      aria-label="Акция для малого бизнеса"
      className={`flex w-full max-w-[818px] flex-col gap-16 rounded-24 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between min-[900px]:gap-40 ${lesson ? "bg-[linear-gradient(232.657deg,rgb(240,248,255)_20.714%,rgb(247,247,248)_94.867%)] p-24 md:p-40" : "bg-bg-card/96 p-16 shadow-drop-lg min-[900px]:py-24 min-[900px]:pr-24 min-[900px]:pl-32"}`}
    >
      <div className="flex min-w-0 flex-col items-start gap-4">
        <p className="text-body-l font-medium text-text-primary">
          ИИ-команда в подарок: 185 дней GigaCowork со скидкой 100%
        </p>
        <p className="text-caption text-text-secondary">
          Для юрлиц и ИП с платным РКО Сбера от{" "}
          <span className="whitespace-nowrap">
            1 000 ₽ в месяц
            <span aria-hidden className="mx-8 text-text-tertiary">·</span>
            <a
              href={PROMO_TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[22px] items-center align-middle text-status-accent underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
            >
              Правила акции
            </a>
          </span>
        </p>
      </div>
      <Button
        href="/ai-for-smb/promo/"
        variant="accentSubtle"
        size="md"
        className="w-full shrink-0 sm:w-auto"
      >
        Подробнее об акции
        <Icon src="/img/icons/promo-arrow-up.svg" className="size-[20px]" />
      </Button>
    </aside>
  );
}

export default PromoBanner;
