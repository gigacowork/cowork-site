"use client";

import { useState } from "react";
import Link from "next/link";
import CopySkillButton from "./CopySkillButton";
import CatalogTypeIcon from "./CatalogTypeIcon";
import type { CatalogMetrics } from "@/lib/catalog-source";
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
  fileCount: number;
  sourceFiles: { name: string; href: string }[];
  gitHref: string;
  metrics: CatalogMetrics;
};

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

function fileCount(count: number) {
  const lastTwo = count % 100;
  const last = count % 10;
  const noun = lastTwo >= 11 && lastTwo <= 14 ? "файлов" : last === 1 ? "файл" : last >= 2 && last <= 4 ? "файла" : "файлов";
  return `${count} ${noun}`;
}

function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("ru").replaceAll("ё", "е");
}

export default function ScenarioCatalogue({ cards }: { cards: CatalogCard[] }) {
  const [selectedType, setSelectedType] = useState<CatalogCard["type"]>("plugin");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const typeCards = cards.filter((card) => card.type === selectedType);
  const available = [...new Set(typeCards.map((card) => card.category))];
  const categories = ["Все", ...available.sort((a, b) => a.localeCompare(b, "ru"))];
  const searchWords = normalizeSearch(search.trim()).split(/\s+/).filter(Boolean);
  const visibleCards = typeCards.filter((card) => {
    if (selectedCategory !== "Все" && card.category !== selectedCategory) return false;
    const searchableText = normalizeSearch([card.title, card.description, card.category, card.eyebrow, ...card.tags].join(" "));
    return searchWords.every((word) => searchableText.includes(word));
  });

  return (
    <>
      <div className={styles.catalogueToolbar}>
        <div className={styles.typeTabs} role="group" aria-label="Тип расширения">
          {types.map((type) => (
            <button
              className={`${styles.typeTab} ${selectedType === type.id ? styles.typeTabActive : ""}`}
              type="button"
              key={type.id}
              aria-pressed={selectedType === type.id}
            onClick={() => { setSelectedType(type.id); setSelectedCategory("Все"); }}
          >
              <CatalogTypeIcon kind={type.id} />
              {type.title}
            </button>
          ))}
        </div>
        <div className={styles.searchField}>
          <label className={styles.searchLabel} htmlFor="catalogue-search">Поиск по каталогу</label>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
          <input
            id="catalogue-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск по каталогу"
            autoComplete="off"
          />
          {search && <button type="button" aria-label="Очистить поиск" onClick={() => setSearch("")}>×</button>}
        </div>
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
                <span className={`${styles.cardTop} ${card.downloadHref ? styles.cardTopWithCopy : ""}`}><span className={styles.cardTopTags}><span className={styles.typeBadge}><CatalogTypeIcon kind={card.type} />{types.find((type) => type.id === card.type)?.tag}</span><span className={styles.tag}>{card.category}</span></span></span>
                <span className={styles.industry}>{card.eyebrow}</span>
                <strong>{card.title}</strong>
                <span className={styles.pain}>{card.description}</span>
                {card.tags.length > 0 && <span className={styles.metaTags}>{card.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</span>}
                <span className={styles.cardMore}>Подробнее</span>
              </Link>
              {card.downloadHref && <CopySkillButton href={card.downloadHref} className={styles.copySkillButton} />}
              <div className={styles.cardFooter}>
                <div className={styles.cardStats}>
                  <span aria-label={`Рейтинг: ${card.metrics.rating === undefined ? "нет данных" : card.metrics.rating.toFixed(1)}`}>
                    ★ Рейтинг {card.metrics.rating === undefined ? "—" : card.metrics.rating.toFixed(1)}
                  </span>
                  <span aria-label={`Скачивания: ${card.metrics.downloads === undefined ? "нет данных" : card.metrics.downloads}`}>
                    ↓ Скачивания {card.metrics.downloads === undefined ? "—" : new Intl.NumberFormat("ru-RU").format(card.metrics.downloads)}
                  </span>
                </div>
                <div className={styles.cardFiles}>
                  <span>{fileCount(card.fileCount)}</span>
                  {card.sourceFiles.map((file) => (
                    <a key={file.href} href={file.href} target="_blank" rel="noopener noreferrer">{file.name} ↗</a>
                  ))}
                  <a href={card.gitHref} target="_blank" rel="noopener noreferrer">GitVerse ↗</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h3>{searchWords.length ? "Ничего не найдено" : "В этой области пока нет карточек"}</h3>
          {searchWords.length > 0 && <p>Попробуйте другой запрос или очистите поиск.</p>}
        </div>
      )}
    </>
  );
}
