import type { Metadata } from "next";
import { UseCaseBenefits } from "@/components/use-cases/UseCaseBenefits";
import { UseCaseHero } from "@/components/use-cases/UseCaseHero";
import { pageMetadata } from "@/lib/site";
import { SMB_TARIFF_PATH } from "@/lib/smb-use-cases";

export const metadata: Metadata = pageMetadata({
  title: "Специальные тарифы для малого бизнеса — GigaCowork",
  description:
    "Условия акционного доступа к GigaCowork для команды до пяти человек при подключении СберБизнесПрайм.",
  path: `${SMB_TARIFF_PATH}/`,
});

export default function SmbTariffsPage() {
  return (
    <>
      <UseCaseHero
        title="Специальные тарифы для малого бизнеса"
        breadcrumb="Специальные тарифы"
        intro={[
          "По акции команда до пяти человек может использовать GigaCowork 185 дней при подключении СберБизнесПрайм от 1 000 ₽. В акционный доступ входят до 10 интеграций с внешними системами и 150 ГБ хранилища.",
        ]}
        ctaLabel="Посмотреть действующие тарифы"
        ctaHref="/pricing"
      />

      <UseCaseBenefits
        kicker="Условия акции"
        title="Начните с реальных задач команды"
        lead="После акционного периода GigaCowork можно приобрести по действующим тарифам. Перейти на платный тариф можно и раньше."
        items={[
          {
            title: "До пяти пользователей",
            paragraphs: [
              "Подключите небольшую команду и проверьте сценарии на повседневных задачах бизнеса.",
            ],
          },
          {
            title: "До 10 интеграций",
            paragraphs: [
              "Подключайте внешние системы, которые нужны для ваших задач, с учётом настроек доступа.",
            ],
          },
          {
            title: "150 ГБ хранилища",
            paragraphs: [
              "Разместите рабочие документы и материалы, необходимые команде для первых сценариев.",
            ],
          },
        ]}
      />
    </>
  );
}
