import { Button } from "@/components/ui/Button";
import { SMB_CTA_URL, SMB_RKO_URL } from "@/components/sections/SmbOfferCta";
import { asset } from "@/lib/asset";
import { PROMO_TERMS_URL } from "@/lib/legal";

/** Промополоса акции — Figma 6356:120666 (desktop), 6381:121807 (mobile). */
export function HomePromoBar({ onClose }: { onClose: () => void }) {
  return (
    <aside
      id="home-promo-bar"
      aria-label="Акция ИИ-команда в подарок"
      className="relative z-10 flex h-[120px] w-full flex-col items-center justify-center gap-8 border-b border-border-subtle bg-[rgba(255,255,255,0.79)] px-16 py-12 shadow-[0_6px_24px_rgba(23,31,46,0.08)] backdrop-blur-[16px] min-[900px]:h-48 min-[900px]:flex-row min-[900px]:gap-32 min-[900px]:border-white/70 min-[900px]:bg-white/45 min-[900px]:px-48 min-[900px]:py-0 min-[900px]:shadow-[0_4px_16px_rgba(64,92,140,0.06)]"
    >
      <p className="text-center text-body-m leading-[1.2] tracking-[-0.02em] text-text-primary min-[900px]:whitespace-nowrap">
        <span className="font-medium">ИИ-команда в&nbsp;подарок:</span>
        <br className="min-[900px]:hidden" />
        <span className="hidden min-[900px]:inline"> </span>
        185&nbsp;дней доступа к&nbsp;GigaCowork
      </p>

      <div className="flex max-w-full flex-col items-center gap-8 min-[900px]:flex-row min-[900px]:gap-32">
        <Button
          href={SMB_CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size="sm"
          className="h-32 shrink-0 max-[900px]:bg-action-primary-disabled! max-[900px]:hover:bg-action-primary-disabled!"
        >
          Оставить заявку
        </Button>

        <div className="flex min-w-0 items-center gap-12 text-caption leading-[1.2] tracking-[-0.02em] min-[900px]:gap-[14px] min-[900px]:text-body-m">
          <p className="whitespace-nowrap text-text-secondary">
            Нет РКО?{" "}
            <a
              href={SMB_RKO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8c8fe4] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
            >
              Оставьте заявку
            </a>
          </p>
          <a
            href={PROMO_TERMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit whitespace-nowrap text-[#adacac] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          >
            Правила акции
          </a>
        </div>
      </div>

      <button
        type="button"
        aria-label="Закрыть баннер акции"
        onClick={onClose}
        className="absolute right-24 top-[14px] hidden size-[20px] cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary min-[900px]:flex"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/img/cta/home-promo-close.svg")} alt="" />
      </button>
    </aside>
  );
}

export default HomePromoBar;
