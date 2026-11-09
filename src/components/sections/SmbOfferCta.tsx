import { Button } from "@/components/ui/Button";
import { HeroImage } from "@/components/ui/HeroImage";
import { PROMO_TERMS_URL } from "@/lib/legal";

export const SMB_CTA_URL =
  "https://www.sberbank.ru/ru/s_m_business/nbs/gigacowork?utm_source=gigacowork&utm_medium=site&utm_campaign=185mmb-gigacowork";
export const SMB_RKO_URL =
  process.env.NEXT_PUBLIC_SMB_RKO_URL?.trim() ||
  "https://www.sberbank.ru/ru/s_m_business/bankingservice/rko";

/** Акционное предложение для сценариев и уроков малого бизнеса. */
export function SmbOfferCta() {
  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-title"
      className="relative isolate w-full overflow-hidden bg-[linear-gradient(233.27deg,#f0f8ff_20.714%,#f7f7f8_94.867%)] px-24 py-32 md:px-80 md:py-160"
    >
      <HeroImage
        desktop="/img/cta/cta-mmb-bg.png"
        mobile="/img/cta/cta-mmb-bg-mob.png"
        className="pointer-events-none absolute inset-0 -z-10 size-full object-cover object-bottom"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(224.8deg,rgba(240,248,255,0.56)_25.565%,rgba(247,247,248,0)_85.993%)] md:hidden"
      />

      <div className="relative mx-auto flex w-full max-w-[588px] flex-col items-center gap-40 pb-120 pt-24 text-center md:py-0">
        <div className="flex w-full flex-col items-center gap-32 md:gap-16">
          <h2 id="final-cta-title" className="w-full text-h2 font-medium text-text-primary">
            ИИ-команда в&nbsp;подарок
          </h2>
          <p className="min-h-[96px] w-full max-w-[304px] text-body-l text-text-secondary md:min-h-0 md:max-w-none">
            Получите 185&nbsp;дней доступа к&nbsp;GigaCowork при выполнении условий
            акции по&nbsp;расчётно-кассовому обслуживанию в&nbsp;Сбере
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-24">
          <div className="flex w-full flex-col items-center gap-16">
            <p className="text-body-l text-text-primary">Участвовать в&nbsp;акции</p>
            <Button
              href={SMB_CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
            >
              Оставить заявку
            </Button>
          </div>

          <div className="w-full text-body-m text-text-secondary">
            <p>
              Для новых клиентов:{" "}
              <a
                href={SMB_RKO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
              >
                оставьте заявку на&nbsp;РКО.
              </a>
            </p>
            <p className="mt-8">
              После открытия счёта и&nbsp;выполнения условий вы сможете
              участвовать в&nbsp;акции.
            </p>
          </div>

          <a
            href={PROMO_TERMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-m text-text-primary underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          >
            Правила акции
          </a>
        </div>
      </div>
    </section>
  );
}
