import type { Metadata } from "next";
import digest from "@/data/kommersant-promo.json";
import { ScenarioChat } from "./ScenarioChat";
import { LEGAL_LINES } from "@/lib/legal";
import styles from "./scenarios.module.css";

export const metadata: Metadata = {
  title: "Читайте главное, делегируйте остальное — GigaCowork × Коммерсантъ",
  description: "Попробуйте ИИ-агентов GigaCowork: обзор новостей, проверка договора, сравнение предложений и подготовка отчета.",
  robots: { index: false, follow: false },
};

export default function KommersantPromoPage() {
  return <ScenarioChat initialDigest={digest} footer={<footer className={styles.legalFooter} aria-label="Реквизиты и правовые документы">
      <div className={styles.legalFooterContent}>
        <p>{LEGAL_LINES[0]}<br />{LEGAL_LINES[1]}</p>
        <ul>
          <li><a href="https://cowork.ru/legal/politika_konfidentsialnosti.pdf" target="_blank" rel="noopener noreferrer">Политика конфиденциальности</a></li>
          <li><a href="https://cowork.ru/legal/politika_obrabotki_personalnykh_dannykh.pdf" target="_blank" rel="noopener noreferrer">Политика обработки данных</a></li>
        </ul>
      </div>
    </footer>} />;
}
