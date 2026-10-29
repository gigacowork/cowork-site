"use client";

import { useRef, useState } from "react";

import styles from "./ai-basics-quiz.module.css";

const questions = [
  {
    title: "Как связаны искусственный интеллект и нейросеть?",
    options: [
      "Это два названия одной и той же программы",
      "Нейросеть — один из видов моделей машинного обучения в области ИИ",
      "Любая система ИИ обязательно состоит из нейросети",
    ],
    correct: 1,
    explanation: "ИИ — широкая область. Нейросеть — один из способов построить модель машинного обучения.",
  },
  {
    title: "Что такое параметры нейросети?",
    options: [
      "Числа внутри модели, которые влияют на её вычисления",
      "Файлы, которые пользователь прикрепляет к запросу",
      "Готовые ответы, сохранённые для каждого вопроса",
    ],
    correct: 0,
    explanation: "Параметры настраиваются при обучении и затем участвуют в обработке нового ввода.",
  },
  {
    title: "Что происходит во время обучения модели?",
    options: [
      "Модель просто запоминает все будущие вопросы",
      "Модель делает предположение, сравнивает его с примером и меняет параметры",
      "Пользователь каждый раз вручную записывает правила для новой задачи",
    ],
    correct: 1,
    explanation: "Упрощённо обучение — повторяющийся цикл предположения, сравнения и настройки параметров.",
  },
  {
    title: "Вы отправили обычный новый запрос. Что делает готовая модель?",
    options: [
      "Заново проходит полный цикл обучения",
      "Выбирает целый готовый ответ из списка",
      "Применяет изученные закономерности к запросу и доступному контексту",
    ],
    correct: 2,
    explanation: "Работа с новым вводом называется применением модели. Обычный запрос сам по себе не переобучает её.",
  },
  {
    title: "Что такое токены при работе языковой модели?",
    options: [
      "Небольшие части текста, с которыми работает модель",
      "Оценки правильности каждого ответа",
      "Обязательные команды для запуска нейросети",
    ],
    correct: 0,
    explanation: "Языковая модель обрабатывает текст частями — токенами — и последовательно формирует продолжение.",
  },
  {
    title: "Какой пример относится к прогнозу?",
    options: [
      "Найти условие о гарантии в письме поставщика",
      "Оценить объём закупки на следующей неделе по прошлым заказам",
      "Составить письмо поставщику с уточняющими вопросами",
    ],
    correct: 1,
    explanation: "Прогноз оценивает будущий показатель по имеющимся данным. Остальные примеры — распознавание и генерация.",
  },
  {
    title: "Какой результат показывает работу генеративного ИИ?",
    options: [
      "Категория «гарантия» для условия из письма",
      "Оценка объёма следующей закупки",
      "Новый черновик письма поставщику с вопросами",
    ],
    correct: 2,
    explanation: "Генеративный ИИ создаёт новый материал, например текст. Категория — распознавание, будущий показатель — прогноз.",
  },
] as const;

const alphabet = ["А", "Б", "В"];

export default function AiBasicsQuiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const quizRef = useRef<HTMLElement>(null);
  const finished = current === questions.length;
  const score = answers.reduce<number>((total, answer, index) => total + (answer === questions[index].correct ? 1 : 0), 0);

  const choose = (optionIndex: number) => {
    setAnswers((previous) => previous.map((answer, index) => index === current ? optionIndex : answer));
  };

  const next = () => {
    if (answers[current] === null) return;
    setCurrent((index) => index + 1);
  };

  const retry = () => {
    setCurrent(0);
    setAnswers(Array(questions.length).fill(null));
    quizRef.current?.focus();
    quizRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };

  return (
    <section ref={quizRef} tabIndex={-1} aria-labelledby="ai-basics-quiz-title" className={styles.quiz}>
      <div className={styles.intro}>
        <span className={styles.kicker}>КОРОТКИЙ ОПРОС</span>
        <h3 id="ai-basics-quiz-title">Проверьте себя</h3>
        <p>Ответьте на 7 вопросов — результат появится в конце.</p>
      </div>

      {finished ? (
        <div className={styles.result} aria-live="polite">
          <span className={styles.resultLabel}>РЕЗУЛЬТАТ ОПРОСА</span>
          <strong className={styles.resultScore}>{score}/{questions.length} правильно</strong>
          <p className={styles.resultMessage}>
            {score === questions.length
              ? "Вы разобрались в основных понятиях и принципах работы модели."
              : score >= 5
                ? "Основа усвоена. Ниже можно посмотреть, какие понятия стоит повторить."
                : "Вернитесь к схемам обучения и применения модели, затем попробуйте ещё раз."}
          </p>
          <div className={styles.review}>
            <h4>Разбор ответов</h4>
            <ol>
              {questions.map((question, index) => {
                const isCorrect = answers[index] === question.correct;
                return (
                  <li key={question.title} className={styles.reviewItem}>
                    <span className={`${styles.reviewMark} ${isCorrect ? styles.reviewCorrect : styles.reviewIncorrect}`} aria-label={isCorrect ? "Верно" : "Ошибка"}>
                      {isCorrect ? "✓" : "×"}
                    </span>
                    <div>
                      <strong>{question.title}</strong>
                      {!isCorrect ? <p>Верный ответ: {question.options[question.correct]}.</p> : null}
                      <p>{question.explanation}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <button type="button" className={styles.primaryButton} onClick={retry}>Пройти ещё раз</button>
        </div>
      ) : (
        <div key={current} className={styles.questionCard}>
          <div className={styles.questionTopline}>
            <span>ВОПРОС {String(current + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span>
            <span>{Math.round((current / questions.length) * 100)}% пройдено</span>
          </div>
          <div className={styles.progress} aria-hidden="true">
            <span style={{ width: `${(current / questions.length) * 100}%` }} />
          </div>
          <h4>{questions[current].title}</h4>
          <div className={styles.options} role="group" aria-label="Варианты ответа">
            {questions[current].options.map((option, index) => (
              <button
                key={option}
                type="button"
                className={`${styles.option} ${answers[current] === index ? styles.selected : ""}`}
                aria-pressed={answers[current] === index}
                onClick={() => choose(index)}
              >
                <span className={styles.optionLetter}>{alphabet[index]}</span>
                <span>{option}</span>
              </button>
            ))}
          </div>
          <button type="button" className={styles.primaryButton} disabled={answers[current] === null} onClick={next}>
            {current === questions.length - 1 ? "Показать результат" : "Следующий вопрос"}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </section>
  );
}
