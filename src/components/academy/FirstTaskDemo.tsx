"use client";

import { useEffect, useRef, useState } from "react";

import { asset } from "@/lib/asset";
import styles from "./first-task-demo.module.css";

export const FIRST_TASK_PROMPT =
  "Сравни коммерческие предложения поставщиков. Сведи цены, сроки и условия в таблицу. Отметь, какой информации не хватает для выбора, и предложи следующие шаги.";

export const FIRST_TASK_PROMPT_NO_FILES =
  "Помоги выбрать первую рабочую задачу для ИИ. Я занимаюсь [чем вы занимаетесь]. Предложи три небольшие задачи, которые можно выполнить за 15 минут, и задай вопросы, если тебе не хватает контекста.";

const steps = [
  {
    number: "01",
    title: "Промпт",
    text: "Возьмите понятную рабочую задачу. В примере мы сравниваем два предложения поставщиков: называем цель и формат ответа. Замените детали под свою ситуацию.",
  },
  {
    number: "02",
    title: "Контекст: файлы",
    text: "Нажмите «+» в поле ввода. Выберите «С компьютера» и добавьте предложения поставщиков. Исходные данные помогут GigaCowork сделать предметное сравнение.",
  },
  {
    number: "03",
    title: "Результат",
    text: "Отправьте запрос и проверьте ответ: сверьте цифры с исходными файлами. Если вывод неполный, напишите уточнение в том же чате — начинать заново не нужно.",
  },
] as const;

const SCENE_DURATION_MS = 4600;
const RESULT_DURATION_MS = 6500;

const demoFiles = [
  { name: "КП поставщика А.pdf", size: "84 КБ" },
  { name: "КП поставщика Б.pdf", size: "96 КБ" },
] as const;

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  // Иконки взяты из уже существующего интерфейсного макета GigaCowork.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset(`/img/kommersant-promo-v2/${name}.svg`)} width={size} height={size} alt="" />;
}

export default function FirstTaskDemo({ compact = false, showSteps = false, stableHeight = false }: { compact?: boolean; showSteps?: boolean; stableHeight?: boolean }) {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [sceneRun, setSceneRun] = useState(0);
  const [upload, setUpload] = useState({ menuOpen: true, visibleFiles: 0, readyFiles: 0 });
  const [resultPhase, setResultPhase] = useState(0);
  const [resultScrolled, setResultScrolled] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<number | null>(null);
  const syncingScroll = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
      setVisibleLetters(FIRST_TASK_PROMPT.length);
      return;
    }
    if (!playing) return;
    const timeout = window.setTimeout(() => {
      const next = (scene + 1) % steps.length;
      if (next === 0) setVisibleLetters(0);
      if (next === 1) setUpload({ menuOpen: true, visibleFiles: 0, readyFiles: 0 });
      if (next === 2) {
        setResultPhase(0);
        setResultScrolled(false);
      }
      setScene(next);
      setSceneRun((current) => current + 1);
    }, scene === 2 ? RESULT_DURATION_MS : SCENE_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [playing, scene, sceneRun]);

  useEffect(() => {
    if (scene !== 0) {
      setVisibleLetters(FIRST_TASK_PROMPT.length);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleLetters(FIRST_TASK_PROMPT.length);
      return;
    }
    setVisibleLetters(0);
    let letters = 0;
    const interval = window.setInterval(() => {
      letters = Math.min(letters + 3, FIRST_TASK_PROMPT.length);
      setVisibleLetters(letters);
      if (letters === FIRST_TASK_PROMPT.length) window.clearInterval(interval);
    }, 35);
    return () => window.clearInterval(interval);
  }, [scene, sceneRun]);

  useEffect(() => {
    if (scene !== 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setUpload({ menuOpen: false, visibleFiles: demoFiles.length, readyFiles: demoFiles.length });
      return;
    }

    setUpload({ menuOpen: true, visibleFiles: 0, readyFiles: 0 });
    const timers = [
      window.setTimeout(() => setUpload({ menuOpen: false, visibleFiles: 1, readyFiles: 0 }), 850),
      window.setTimeout(() => setUpload({ menuOpen: false, visibleFiles: 2, readyFiles: 0 }), 1100),
      window.setTimeout(() => setUpload({ menuOpen: false, visibleFiles: 2, readyFiles: 1 }), 1800),
      window.setTimeout(() => setUpload({ menuOpen: false, visibleFiles: 2, readyFiles: 2 }), 2050),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [scene, sceneRun]);

  useEffect(() => {
    if (scene !== 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setResultPhase(4);
      return;
    }
    setResultPhase(0);
    const timers = [
      window.setTimeout(() => setResultPhase(1), 800),
      window.setTimeout(() => setResultPhase(2), 1900),
      window.setTimeout(() => setResultPhase(3), 3200),
      window.setTimeout(() => setResultPhase(4), 4500),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [scene, sceneRun]);

  useEffect(() => {
    if (scene !== 2 || !resultRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      const result = resultRef.current;
      if (!result) return;
      result.scrollTo({
        top: result.scrollHeight - result.clientHeight,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [scene, resultPhase]);

  const changeScene = (next: number) => {
    if (next === 0) setVisibleLetters(0);
    if (next === 1) setUpload({ menuOpen: true, visibleFiles: 0, readyFiles: 0 });
    if (next === 2) {
      setResultPhase(0);
      setResultScrolled(false);
    }
    setScene(next);
    setSceneRun((current) => current + 1);
    setPlaying(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards || !window.matchMedia("(max-width: 899px)").matches) return;
    const card = cards.children[scene] as HTMLElement | undefined;
    if (!card) return;
    syncingScroll.current = true;
    if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    cards.scrollTo({ left: card.offsetLeft - (cards.clientWidth - card.offsetWidth) / 2, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    scrollTimer.current = window.setTimeout(() => { syncingScroll.current = false; }, 500);
    return () => { if (scrollTimer.current) window.clearTimeout(scrollTimer.current); };
  }, [scene]);

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
      }, { index: scene, distance: Infinity }).index;
      if (nearest !== scene) changeScene(nearest);
    }, 160);
  };

  return (
    <div className={`${styles.demo} ${compact ? styles.compact : ""} ${stableHeight ? styles.stableHeight : ""}`} aria-label="Демонстрация первой задачи в интерфейсе GigaCowork">
      <div className={styles.workspace}>
        {scene === 2 ? (
          <div
            ref={resultRef}
            className={`${styles.result} ${resultScrolled ? styles.resultScrolled : ""}`}
            key="result"
            aria-label="Результат сравнения предложений"
            tabIndex={0}
            onScroll={(event) => setResultScrolled(event.currentTarget.scrollTop > 2)}
          >
            <p className={styles.resultStatus} role="status">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(resultPhase === 4 ? "/img/icons/check.svg" : "/img/icons/bot.svg")} width={20} height={20} alt="" />
              {resultPhase === 4 ? "Готово" : "Сравниваю условия предложений"}
              {resultPhase < 4 && <span className={styles.statusDots} aria-hidden="true"><i /><i /><i /></span>}
            </p>
            {resultPhase >= 1 && <p className={styles.resultReasoning}>Сверю стоимость и сроки поставки, затем отмечу, каких данных не хватает для выбора.</p>}
            {resultPhase >= 2 && <div className={styles.resultTable} role="table" aria-label="Сравнение предложений поставщиков">
              <div role="row"><b role="columnheader">Параметр</b><b role="columnheader">Поставщик А</b><b role="columnheader">Поставщик Б</b></div>
              <div role="row"><span role="cell">Стоимость</span><span role="cell">1 180 000 ₽</span><span role="cell" className={resultPhase >= 3 ? styles.resultPositive : ""}>1 150 000 ₽</span></div>
              <div role="row"><span role="cell">Срок</span><span role="cell">14 дней</span><span role="cell" className={resultPhase >= 3 ? styles.resultPositive : ""}>10 дней</span></div>
              {resultPhase >= 3 && <div role="row"><span role="cell">Срок гарантии</span><span role="cell">12 месяцев</span><span role="cell" className={styles.resultMissing}>Не указан</span></div>}
            </div>}
            {resultPhase >= 4 && <div className={styles.resultSummary}><b>У поставщика Б ниже цена и короче срок</b><p>Перед выбором уточните срок гарантии у поставщика Б.</p></div>}
          </div>
        ) : (
          <div className={styles.startScreen}>
            <div className={styles.composer}>
              <div className={styles.inputBox}>
                {scene === 1 && upload.visibleFiles > 0 && (
                  <div className={styles.attachments} aria-label="Прикреплённые файлы">
                    {demoFiles.slice(0, upload.visibleFiles).map((file, index) => {
                      const loading = index >= upload.readyFiles;
                      return (
                        <div key={file.name} className={styles.fileCard} aria-busy={loading}>
                          <span className={styles.fileIcon}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={asset("/img/kommersant-promo-scenarios/file.svg")} width={20} height={20} alt="" />
                            {loading && <span className={styles.uploadSpinner} aria-hidden="true" />}
                          </span>
                          <span className={styles.fileText}><b>{file.name}</b><small>{loading ? "Загружаю…" : file.size}</small></span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className={styles.prompt}>
                  <span>{FIRST_TASK_PROMPT.slice(0, visibleLetters)}</span>
                  {scene === 0 && visibleLetters < FIRST_TASK_PROMPT.length ? <span className={styles.caret} aria-hidden="true" /> : null}
                </div>
                <div className={styles.toolbar}>
                  <div className={styles.toolbarLeft}>
                    <span className={`${styles.toolButton} ${scene === 1 && upload.menuOpen ? styles.activeTool : ""}`}><Icon name="plus" /></span>
                    <span className={styles.toolButton}><Icon name="square-slash" /></span>
                    <span className={styles.agentPill}><Icon name="dog" size={14} /> Агент <Icon name="chevron-down" size={12} /></span>
                  </div>
                  <div className={styles.toolbarRight}>
                    <Icon name="microphone" />
                    <span className={`${styles.send} ${visibleLetters === 0 ? styles.sendDisabled : ""}`} aria-hidden="true">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.6837 10.9455C15.8801 10.7852 16.1706 10.7966 16.3537 10.9796L21.0197 15.6466C21.2149 15.8419 21.2149 16.1584 21.0197 16.3537C20.8244 16.5487 20.5078 16.5488 20.3127 16.3537L16.5002 12.5402V20.6662C16.5002 20.9422 16.2761 21.166 16.0002 21.1662C15.724 21.1662 15.5002 20.9423 15.5002 20.6662V12.5402L11.6867 16.3537C11.4915 16.5488 11.1749 16.5487 10.9796 16.3537C10.7844 16.1584 10.7845 15.8419 10.9796 15.6466L15.6466 10.9796L15.6837 10.9455Z" fill="white" fillOpacity="0.95" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.connectorsRow}><span className={styles.connectorAvatars}><i>24</i><i>J</i><i>1C</i></span><span>+ 40 интеграций⌄</span></div>
            </div>
            {scene === 1 && upload.menuOpen && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.fileMenuImage} src={asset("/img/academy/upload-menu.svg")} width={239} height={130} alt="В меню загрузки выбран пункт «С компьютера»" />
            )}
          </div>
        )}
      </div>

      {showSteps && (
        <div ref={cardsRef} className={styles.stepCards} role="group" aria-label="Шаги первой задачи" onScroll={selectScrolledCard}>
          {steps.map((step, index) => (
            <button
              key={step.number}
              type="button"
              className={`${styles.stepCard} ${scene === index ? styles.stepCardActive : ""}`}
              aria-pressed={scene === index}
              onClick={() => changeScene(index)}
            >
              <span className={styles.stepNumber}>ШАГ {step.number}</span>
              <strong className={styles.stepTitle}>{step.title}</strong>
              <span className={styles.stepText}>{step.text}</span>
              <span className={styles.progressTrack} aria-hidden="true">
                {scene === index && <span key={sceneRun} className={`${styles.progressFill} ${playing ? "" : styles.progressPaused}`} style={{ animationDuration: `${index === 2 ? RESULT_DURATION_MS : SCENE_DURATION_MS}ms` }} />}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
