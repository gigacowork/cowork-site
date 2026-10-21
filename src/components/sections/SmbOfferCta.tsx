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
          {keepSmbShortWords("Акция: ИИ-команда в подарок")}
          <br />
          {keepSmbShortWords("GigaCowork 185 дней бесплатно")}
        </>
      }
      detailsHref={PROMO_TERMS_URL}
      detailsLabel="Правила акции"
      buttonLabel="Перейти"
      buttonHref="/ai-for-smb/promo/"
    />
  );
}
