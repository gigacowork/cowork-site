import Clients from "@/components/sections/Clients";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { PAGE_SEO } from "@/content/seo";
import { seoMetadata } from "@/lib/site";
import NoHours from "@/components/sections/NoHours";
import HowAgentsWork from "@/components/sections/HowAgentsWork";
import Metrics from "@/components/sections/Metrics";
import UnlimitedTokens from "@/components/sections/UnlimitedTokens";
import PartOfTeam from "@/components/sections/PartOfTeam";
import Cases from "@/components/sections/Cases";
import Infrastructure from "@/components/sections/Infrastructure";
import FinalCta from "@/components/sections/FinalCta";

import HeroWithChat from "@/components/interactive/HeroWithChat";
import HorizontalScrollCards from "@/components/interactive/HorizontalScrollCards";
import StackingCards from "@/components/interactive/StackingCards";
import CountUp from "@/components/interactive/CountUp";
import RevealCards from "@/components/interactive/RevealCards";
import TokenIllustrations from "@/components/interactive/TokenIllustrations";

/* Шапка и подвал — в src/app/layout.tsx, они общие для всех страниц. */

/*
  Метатеги главной перекрывают корневые: там они запасные для всего сайта,
  здесь — из SEO-документа страницы.
*/
export const metadata: Metadata = seoMetadata(PAGE_SEO.home);

export default function Home() {
  return (
    <>
      <JsonLd data={PAGE_SEO.home.jsonLd!} />

      {/* 2 — Hero + анимированный чат */}
      <HeroWithChat />

      {/* 3 — «Не тратьте часы…» со скролл-джекингом карточек */}
      <HorizontalScrollCards>
        <NoHours />
      </HorizontalScrollCards>

      {/* 4 — Логотипы клиентов */}
      {/*
        Снизу отступ больше: выше стоит блок с горизонтальной прокруткой, он
        оставляет за собой собственный хвост воздуха, и при равных 64 сверху
        над логотипами выходило 220, а под ними 90. Здесь оба зазора равны.
      */}
      <Clients paddingClassName="pt-64 pb-[194px]" />

      {/* 5 — «Как работают ИИ-агенты» со stacking-скроллом */}
      <StackingCards>
        <HowAgentsWork />
      </StackingCards>

      {/* 6 — Метрики с counter-анимацией */}
      <CountUp>
        <Metrics />
      </CountUp>

      {/*
        6.2 — Безлимитное количество токенов.
        Сами карточки не анимируются — движутся только слои внутри иллюстраций.
      */}
      <TokenIllustrations>
        <UnlimitedTokens />
      </TokenIllustrations>

      {/* 7 — Сделайте ИИ-агентов частью команды с появлением карточек */}
      <RevealCards>
        <PartOfTeam />
      </RevealCards>

      {/* 8 — Опыт клиентов */}
      <Cases />

      {/* 9 — Безопасная российская ИИ-инфраструктура */}
      <Infrastructure />

      {/* 10 — Финальный CTA (влево, как и остальные заголовки главной) */}
      <FinalCta />
    </>
  );
}
