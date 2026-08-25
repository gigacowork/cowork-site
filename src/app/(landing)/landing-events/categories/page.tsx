import type { Metadata } from "next";
import ScreenFrame from "@/components/landing-events/ScreenFrame";
import CategoryCard from "@/components/landing-events/CategoryCard";
import { IconLink, PillButton } from "@/components/landing-events/Controls";
import { DEMO_URL, LANDING_CATEGORIES } from "@/lib/landing-events";
import styles from "@/components/landing-events/landing-events.module.css";

export const metadata: Metadata = {
  title: "ИИ-команда для вашего бизнеса — GigaCowork",
};

/** Экран выбора сценария: две крупные карточки сверху, три поменьше снизу. */
export default function LandingEventsCategories() {
  return (
    <ScreenFrame
      headerExtra={
        <div className={styles.categoriesHeader}>
          <h1 className={styles.categoriesTitle}>
            ИИ-команда для вашего бизнеса
          </h1>
        </div>
      }
      footer={
        <div className={styles.footerRow}>
          <div className={styles.footerLeft}>
            <IconLink
              icon="/landing-events/decor/icon-home.png"
              alt="На главную"
              href="/landing-events"
            />
            <PillButton
              href="/landing-events"
              variant="light"
              icon="/landing-events/decor/icon-back.png"
            >
              Назад
            </PillButton>
          </div>
          <PillButton href={DEMO_URL} external variant="dark">
            Демо
          </PillButton>
        </div>
      }
    >
      <div className={styles.grid}>
        {LANDING_CATEGORIES.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            className={index < 2 ? styles.spanRow1 : styles.spanRow2}
          />
        ))}
      </div>
    </ScreenFrame>
  );
}
