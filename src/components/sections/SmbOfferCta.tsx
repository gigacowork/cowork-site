import { FinalCta } from "@/components/sections/FinalCta";
import { PROMO_TERMS_URL } from "@/lib/legal";
import { keepSmbShortWords } from "@/lib/smb-use-cases";

/** Общее акционное предложение для сценариев и уроков малого бизнеса. */
export function SmbOfferCta() {
  return (
    <FinalCta
      wideContent
      title={
        <>
          {keepSmbShortWords("ИИ-команда в подарок:")}
          <br />
          {keepSmbShortWords("185 дней GigaCowork со скидкой 100%")}
        </>
      }
      description={keepSmbShortWords("Для юрлиц и ИП с платным РКО Сбера от 1 000 ₽ в месяц")}
      detailsHref={PROMO_TERMS_URL}
      detailsLabel="Правила акции"
      buttonLabel="Перейти"
      buttonHref="/ai-for-smb/promo/"
    />
  );
}
