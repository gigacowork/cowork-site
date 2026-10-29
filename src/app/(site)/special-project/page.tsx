import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { OfficeCases } from "@/components/interactive/OfficeCases";
import { VISIBLE_CASES } from "@/content/cases";
import { asset } from "@/lib/asset";
import { pageMetadata } from "@/lib/site";
import styles from "./special-project.module.css";

export const metadata: Metadata = pageMetadata({
  title: "От Калининграда до Владивостока — спецпроект GigaCowork",
  description:
    "Как ИИ-агенты GigaCowork меняют российский бизнес: реальные кейсы и результаты компаний по всей стране.",
  path: "/special-project/",
});

export default function SpecialProjectPage() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="special-project-title">
        <picture className={styles.heroVisual} aria-hidden="true">
          <source
            media="(max-width: 767px)"
            srcSet={asset("/img/special-project/hero-map-source-mobile.webp")}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/img/special-project/hero-map-source-desktop.webp")}
            alt=""
            fetchPriority="high"
          />
        </picture>

        <div className={`container-page ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1 id="special-project-title" className={styles.heroTitle}>
              От Калининграда до Владивостока
            </h1>
            <p className={styles.heroSubtitle}>
              как ИИ-агенты GigaCowork меняют российский бизнес
            </p>
            <div className={styles.heroActions}>
              <Button
                href="#special-project-cases"
                variant="primary"
                size="lg"
                className={styles.primaryAction}
              >
                Смотреть кейсы <span aria-hidden="true">↓</span>
              </Button>
            </div>
          </div>
        </div>
        <div className={`container-page ${styles.heroDisclaimerWrap}`}>
          <small className={styles.heroDisclaimer}>
            Представленное изображение является художественной 3D-иллюстрацией и не является точной географической картой
          </small>
        </div>
      </section>

      <OfficeCases cases={VISIBLE_CASES} />
    </>
  );
}
