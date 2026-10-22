import { FinalCta } from "@/components/sections/FinalCta";
import { Icon } from "@/components/ui/Icon";

export const SMB_CTA_URL = "https://cowork.ru/lead/?loginDCB=true&userType=WEB";

export function SmbCtaButtonLabel() {
  return (
    <>
      Узнать подробнее
      <Icon src="/img/icons/arrow-up-right.svg" className="size-[9px]" />
    </>
  );
}

/** Общее предложение для сценариев и уроков малого бизнеса. */
export function SmbOfferCta() {
  return (
    <FinalCta
      wideContent
      title={
        <>
          Специальные тарифы
          <br />
          для&nbsp;малого бизнеса
        </>
      }
      buttonLabel={<SmbCtaButtonLabel />}
      buttonHref={SMB_CTA_URL}
      buttonNewTab
    />
  );
}
