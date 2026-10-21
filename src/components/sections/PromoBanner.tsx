import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Баннер акции на главной — Figma 6075:73336. */
export function PromoBanner({ lesson = false }: { lesson?: boolean }) {
  return (
    <aside
      aria-label="Акция для малого бизнеса"
      className={`flex w-full max-w-[780px] flex-col gap-16 rounded-24 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between min-[900px]:gap-40 ${lesson ? "bg-[linear-gradient(232.657deg,rgb(240,248,255)_20.714%,rgb(247,247,248)_94.867%)] p-24 md:p-40" : "bg-bg-card/96 p-16 shadow-drop-lg min-[900px]:py-24 min-[900px]:pr-24 min-[900px]:pl-32"}`}
    >
      <div className="flex min-w-0 flex-col items-start gap-4">
        <p className="text-h4 font-medium text-text-primary">ИИ-команда в подарок</p>
        <p className="text-body-l text-text-secondary">GigaCowork 185 дней бесплатно</p>
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
