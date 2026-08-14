import Header from "@/components/sections/Header";
import Clients from "@/components/sections/Clients";
import NoHours from "@/components/sections/NoHours";
import HowAgentsWork from "@/components/sections/HowAgentsWork";
import Metrics from "@/components/sections/Metrics";
import UnlimitedTokens from "@/components/sections/UnlimitedTokens";
import PartOfTeam from "@/components/sections/PartOfTeam";
import Cases from "@/components/sections/Cases";
import Infrastructure from "@/components/sections/Infrastructure";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";

import HeroWithChat from "@/components/interactive/HeroWithChat";
import HorizontalScrollCards from "@/components/interactive/HorizontalScrollCards";
import StackingCards from "@/components/interactive/StackingCards";
import CountUp from "@/components/interactive/CountUp";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* 2 — Hero + анимированный чат */}
        <HeroWithChat />

        {/* 3 — «Не тратьте часы…» со скролл-джекингом карточек */}
        <HorizontalScrollCards>
          <NoHours />
        </HorizontalScrollCards>

        {/* 4 — Логотипы клиентов */}
        <Clients />

        {/* 5 — «Как работают ИИ-агенты» со stacking-скроллом */}
        <StackingCards>
          <HowAgentsWork />
        </StackingCards>

        {/* 6 — Метрики с counter-анимацией */}
        <CountUp>
          <Metrics />
        </CountUp>

        {/* 6.2 — Безлимитное количество токенов */}
        <UnlimitedTokens />

        {/* 7 — Сделайте ИИ-агентов частью команды */}
        <PartOfTeam />

        {/* 8 — Опыт клиентов */}
        <Cases />

        {/* 9 — Безопасная российская ИИ-инфраструктура */}
        <Infrastructure />

        {/* 10 — Финальный CTA */}
        <FinalCta />
      </main>

      {/* 11 — Footer */}
      <Footer />
    </>
  );
}
