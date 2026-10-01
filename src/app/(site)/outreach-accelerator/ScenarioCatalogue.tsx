"use client";

import { useState } from "react";
import Link from "next/link";
import CopySkillButton from "./CopySkillButton";
import styles from "./outreach.module.css";

export type CatalogCard = {
  href: string;
  type: "plugin" | "integration" | "skill";
  category: string;
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  downloadHref?: string;
};

const preferredOrder = ["Продажи", "Маркетинг", "Клиентский сервис", "HR", "Право", "ИТ", "Руководители", "Внедрение ИИ"];
const types = [
  { id: "plugin", title: "Плагины", tag: "Плагин" },
  { id: "integration", title: "Интеграции", tag: "Интеграция" },
  { id: "skill", title: "Навыки", tag: "Навык" },
] as const;

function itemCount(count: number) {
  const lastTwo = count % 100;
  const last = count % 10;
  const noun = lastTwo >= 11 && lastTwo <= 14 ? "карточек" : last === 1 ? "карточка" : last >= 2 && last <= 4 ? "карточки" : "карточек";
  return `${count} ${noun}`;
}

export default function ScenarioCatalogue({ cards }: { cards: CatalogCard[] }) {
  const [selectedType, setSelectedType] = useState<CatalogCard["type"]>("plugin");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const typeCards = cards.filter((card) => card.type === selectedType);
  const available = [...new Set(typeCards.map((card) => card.category))];
  const categories = ["Все", ...preferredOrder.filter((category) => available.includes(category)), ...available.filter((category) => !preferredOrder.includes(category)).sort((a, b) => a.localeCompare(b, "ru"))];
  const visibleCards = selectedCategory === "Все" ? typeCards : typeCards.filter((card) => card.category === selectedCategory);

  return (
    <>
      <div className={styles.typeTabs} role="group" aria-label="Тип расширения">
        {types.map((type) => (
          <button
            className={`${styles.typeTab} ${selectedType === type.id ? styles.typeTabActive : ""}`}
            type="button"
            key={type.id}
            aria-pressed={selectedType === type.id}
            onClick={() => { setSelectedType(type.id); setSelectedCategory("Все"); }}
          >
            {type.title}
          </button>
        ))}
      </div>
      <div className={styles.chipRow} aria-label="Фильтр по профессиональной области">
        <div className={styles.chips} role="group" aria-label="Профессиональные области">
          {categories.map((category) => (
            <button
              className={`${styles.chip} ${category === selectedCategory ? styles.chipActive : ""}`}
              type="button"
              key={category}
              aria-pressed={category === selectedCategory}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <span className={styles.count} aria-live="polite">{itemCount(visibleCards.length)}</span>
      </div>

      {visibleCards.length ? (
        <div className={styles.grid}>
          {visibleCards.map((card) => (
            <article className={styles.cardShell} key={card.href}>
              <Link
                className={styles.card}
                href={card.href}
                aria-label={`Открыть: ${card.title}`}
              >
                <span className={`${styles.cardTop} ${card.downloadHref ? styles.cardTopWithCopy : ""}`}><span className={styles.cardTopTags}><span className={styles.typeBadge}>{types.find((type) => type.id === card.type)?.tag}</span><span className={styles.tag}>{card.category}</span></span>{!card.downloadHref && <span className={styles.cardArrow} aria-hidden="true">↗</span>}</span>
                <span className={styles.industry}>{card.eyebrow}</span>
                <strong>{card.title}</strong>
                <span className={styles.pain}>{card.description}</span>
                {card.tags.length > 0 && <span className={styles.metaTags}>{card.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</span>}
                <span className={styles.cardBottom}><span>Подробнее</span></span>
              </Link>
              {card.downloadHref && <CopySkillButton href={card.downloadHref} className={styles.copySkillButton} />}
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}><h3>В этой области пока нет карточек</h3></div>
      )}
    </>
  );
}
