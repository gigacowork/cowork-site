import type { Metadata } from "next";

import { FinalCta } from "@/components/sections/FinalCta";
import { HeroImage } from "@/components/ui/HeroImage";
import { asset } from "@/lib/asset";

import { DemoFrame } from "./DemoFrame";
import styles from "./promo.module.css";

const DEMO_URL =
  "https://sasha-the-best.muravskiy.com/share/aaaaaaaaaaaaaaaaaaaaaagqae-2hk4x2elgjwtlbd6fgiihap746lo2qaq";

export const metadata: Metadata = {
  title: "GigaCowork для Коммерсанта",
  description: "Интерактивное демо ИИ-агента GigaCowork для Коммерсанта.",
  robots: { index: false, follow: false },
};

const railIcons = {
  panel: "/img/kommersant-promo/panel-left.svg",
  layers: "/img/kommersant-promo/layers.svg",
  chart: "/img/kommersant-promo/chart.svg",
  grid: "/img/kommersant-promo/grid.svg",
  settings: "/img/kommersant-promo/settings.svg",
};

function RailIcon({ src }: { src: string }) {
  return (
    <span className={styles.railItem}>
      {/* The SVGs are exported directly from the supplied Figma component. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(src)} width={16} height={16} alt="" />
    </span>
  );
}

function NavigationRail() {
  // The shared demo does not expose routes or a postMessage API for these icons.
  // Keep the supplied rail visual until the embedded app can own its navigation.
  return (
    <div className={styles.rail} aria-hidden="true">
      <div className={styles.railGroup}>
        <RailIcon src={railIcons.panel} />
        <RailIcon src={railIcons.layers} />
        <RailIcon src={railIcons.chart} />
      </div>
      <div className={styles.railGroup}>
        <RailIcon src={railIcons.grid} />
        <RailIcon src={railIcons.settings} />
        <span className={styles.avatar}>O</span>
      </div>
    </div>
  );
}

export default function KommersantPromoPage() {
  return (
    <>
      <section className={`${styles.hero} relative isolate flex w-full flex-col justify-center overflow-hidden bg-bg-page`}>
        <HeroImage
          desktop="/img/skills/hero.webp"
          mobile="/img/skills/hero-mob.webp"
          className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
        />
        <div className={`${styles.heroContent} container-page flex flex-col items-center text-center md:items-start md:text-left`}>
          <div className="flex flex-col gap-16 md:max-w-[720px] md:gap-24">
            <h1 className="text-h2 font-medium text-text-primary md:text-h1">
              Дайджест актуальных новостей на kommersant.ru
            </h1>
            <p className="text-body-l text-text-secondary">
              Попробуйте ИИ-агента в действии: задавайте вопросы и получайте
              ответы в интерактивном демо.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-bg-page py-48 md:py-96" aria-label="Интерактивное демо">
        <div className="container-page">
          <div className={styles.rotateNotice} role="status">
            <span className={styles.rotateIcon} aria-hidden="true">↻</span>
            <h2>Поверните телефон горизонтально</h2>
            <p>Так вы сможете посмотреть интерактивное демо GigaCowork.</p>
          </div>
          <div className={styles.demoShell}>
            <NavigationRail />
            <DemoFrame src={DEMO_URL} />
          </div>
          <p className={styles.openHint}>
            Если демо не открылось, {" "}
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
              откройте его в новой вкладке
            </a>
            .
          </p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
