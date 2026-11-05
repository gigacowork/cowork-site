import type { Metadata } from "next";
import Link from "next/link";

import Image from "@/components/ui/Image";
import LeadForm from "@/components/sections/LeadForm";
import { LEGAL_LINES } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";
import { LEAD_COPY } from "@/content/lead-copy";

import styles from "./page.module.css";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Пробный доступ к GigaCowork — GigaB2B",
    description: LEAD_COPY.description,
    path: "/lead-gigab2b/",
  }),
  robots: { index: false, follow: false },
};

const imageRoot = "/img/lead-gigab2b/";

const desktopDecor = [
  { name: "haze-blue-l", width: 32, height: 32 },
  { name: "haze-blue-r", width: 1040, height: 760 },
  { name: "cloud-1", width: 800, height: 340 },
  { name: "cloud-2", width: 660, height: 280 },
  { name: "cloud-3", width: 880, height: 380 },
  { name: "cloud-4", width: 1100, height: 420 },
  { name: "cloud-5", width: 740, height: 360 },
  { name: "cloud-6", width: 980, height: 480 },
  { name: "glow-mint", width: 760, height: 500 },
] as const;

const mobileDecor = [
  { name: "m-haze-blue", width: 700, height: 540 },
  { name: "m-cloud-1", width: 480, height: 220 },
  { name: "m-cloud-2", width: 460, height: 210 },
  { name: "m-cloud-3", width: 580, height: 270 },
  { name: "m-glow-mint", width: 520, height: 380 },
  { name: "m-cloud-4", width: 700, height: 360 },
] as const;

function Background() {
  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.desktopSky}>
        {desktopDecor.map(({ name, width, height }) => (
          <Image key={name} src={`${imageRoot}${name}.svg`} alt="" width={width} height={height} data-decor={name} />
        ))}
      </div>
      <div className={styles.mobileSky}>
        {mobileDecor.map(({ name, width, height }) => (
          <Image key={name} src={`${imageRoot}${name}.svg`} alt="" width={width} height={height} data-decor={name} />
        ))}
      </div>
    </div>
  );
}

function Check({ mobile = false }: { mobile?: boolean }) {
  return <Image src={`${imageRoot}${mobile ? "m-" : ""}icon-check.svg`} alt="" width={20} height={20} />;
}

export default function LeadGigaB2BPage() {
  return (
    <div className={styles.page}>
      <Background />
      <header className={styles.header}>
        <Link href="/" aria-label="GigaCowork, на главную">
          <Image className={styles.desktopLogo} src={`${imageRoot}logo-gigacowork.svg`} alt="GigaCowork" width={155} height={33} priority />
          <Image className={styles.mobileLogo} src={`${imageRoot}m-logo-gigacowork.svg`} alt="" width={117} height={25} priority />
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.copy} aria-labelledby="lead-gigab2b-title">
          <div className={styles.intro}>
            <h1 id="lead-gigab2b-title">{LEAD_COPY.titleStart}<br />{LEAD_COPY.titleEnd}</h1>
            <p className={styles.desktopSubtitle}>{LEAD_COPY.intro}</p>
          </div>
          <ul className={styles.benefits}>
            <li className={styles.mobileBenefit}><Check mobile /><span>{LEAD_COPY.intro}</span></li>
            {LEAD_COPY.benefits.map((benefit, index) => (
              <li key={benefit}>
                <span className={styles.desktopCheck}><Check /></span>
                <span className={styles.mobileCheck}><Check mobile /></span>
                <span>{index === 2 ? <>Готовое решение без изменения <br className={styles.mobileTitleBreak} />ИТ-систем</> : benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        <LeadForm
          fields={["name", "email", "phone"]}
          requireAll
          consentCopy="gigab2b"
          previewOnly
          idPrefix="gigab2b"
          className={styles.card}
        />
      </main>

      <footer className={styles.footer}>
        <p className={styles.desktopLegal}>{LEGAL_LINES[0]}<br /> {LEGAL_LINES[1]}</p>
        <p className={styles.mobileLegal}>
          © 2026&nbsp;ООО «Салют для&nbsp;Бизнеса» 121170,<br />
          г. Москва, Кутузовский пр-кт, д. 32,<br />
          ИНН 7804568396, ОКВЭД 58.29, info@gigab2b.ru
        </p>
      </footer>
    </div>
  );
}
