"use client";

import { useEffect, useRef, useState } from "react";

import shared from "./first-task-demo.module.css";
import styles from "./ai-basics-practice.module.css";

const examples = [
  {
    title: "Тема обращения",
    text: "Сообщение клиента превращается в категорию.",
    input: "«Когда привезут мой заказ?»",
    inputLabel: "Сообщение клиента",
    action: "Сопоставляет признаки текста с изученными категориями",
    output: "Тема: доставка",
  },
  {
    title: "Ожидаемый спрос",
    text: "Прошлые продажи помогают оценить будущие.",
    input: "Заказы за предыдущие недели: 92 → 105 → 111",
    inputLabel: "История продаж",
    action: "Находит закономерность в прошлых значениях",
    output: "Оценка на следующую неделю: ≈ 120 заказов",
  },
  {
    title: "Черновик ответа",
    text: "По вопросу клиента появляется новый текст.",
    input: "«Когда привезут мой заказ?»",
    inputLabel: "Сообщение клиента",
    action: "Подбирает продолжение с учётом входного текста",
    output: "«Здравствуйте! Уточните номер заказа, и мы проверим дату доставки.»",
  },
] as const;

const EXAMPLE_DURATION_MS = 9500;

export default function AiBasicsPractice() {
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(true);
  const cardsRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<number | null>(null);
  const syncingScroll = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase(2);
      setPlaying(false);
      return;
    }
    setPhase(0);
    const timers = [
      window.setTimeout(() => setPhase(1), 650),
      window.setTimeout(() => setPhase(2), 1550),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [active, run]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % examples.length);
      setRun((current) => current + 1);
    }, EXAMPLE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [active, run, playing]);

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards || !window.matchMedia("(max-width: 899px)").matches) return;
    const card = cards.children[active] as HTMLElement | undefined;
    if (!card) return;
    syncingScroll.current = true;
    if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    cards.scrollTo({
      left: card.offsetLeft - (cards.clientWidth - card.offsetWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
    scrollTimer.current = window.setTimeout(() => { syncingScroll.current = false; }, 500);
    return () => { if (scrollTimer.current) window.clearTimeout(scrollTimer.current); };
  }, [active]);

  const showExample = (index: number) => {
    setActive(index);
    setPhase(0);
    setPlaying(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setRun((current) => current + 1);
  };

  const selectScrolledCard = () => {
    const cards = cardsRef.current;
    if (!cards || syncingScroll.current) return;
    if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => {
      const center = cards.scrollLeft + cards.clientWidth / 2;
      const nearest = Array.from(cards.children).reduce((best, child, index) => {
        const card = child as HTMLElement;
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        return distance < best.distance ? { index, distance } : best;
      }, { index: active, distance: Infinity }).index;
      if (nearest !== active) showExample(nearest);
    }, 160);
  };

  const example = examples[active];

  return (
    <div className={styles.practice}>
      <div className={styles.demo} aria-label="Интерактивные примеры задач искусственного интеллекта">
        <div className={styles.demoTopline}>
          <span>{String(active + 1).padStart(2, "0")} / 03</span>
        </div>
        <div className={styles.flow}>
          <div className={styles.flowCell}>
            <span className={styles.flowLabel}>Вход · {example.inputLabel}</span>
            <strong className={styles.flowValue}>{example.input}</strong>
          </div>
          <span className={styles.flowArrow} aria-hidden="true">→</span>
          <div className={`${styles.flowCell} ${styles.modelCell}`}>
            <span className={styles.flowLabel}>Модель</span>
            <strong className={styles.flowValue}>{phase >= 1 ? example.action : "Обрабатывает данные"}</strong>
            {phase < 2 ? <span className={styles.processingDots} aria-hidden="true"><i /><i /><i /></span> : null}
          </div>
          <span className={styles.flowArrow} aria-hidden="true">→</span>
          <div className={`${styles.flowCell} ${styles.outputCell}`}>
            <span className={styles.flowLabel}>Результат</span>
            <strong key={`${active}-${run}-${phase >= 2}`} className={`${styles.flowValue} ${phase >= 2 ? styles.revealed : styles.pending}`}>
              {phase >= 2 ? example.output : "Готовится…"}
            </strong>
          </div>
        </div>
      </div>

      <div ref={cardsRef} className={shared.stepCards} role="group" aria-label="Примеры задач ИИ" onScroll={selectScrolledCard}>
        {examples.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className={`${shared.stepCard} ${styles.exampleCard} ${active === index ? shared.stepCardActive : ""}`}
            aria-pressed={active === index}
            onClick={() => showExample(index)}
          >
            <span className={shared.stepNumber}>ПРИМЕР {String(index + 1).padStart(2, "0")}</span>
            <strong className={shared.stepTitle}>{item.title}</strong>
            <span className={shared.stepText}>{item.text}</span>
            <span className={shared.progressTrack} aria-hidden="true">
              {active === index ? <span key={run} className={`${shared.progressFill} ${playing ? "" : shared.progressPaused}`} style={{ animationDuration: `${EXAMPLE_DURATION_MS}ms` }} /> : null}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
