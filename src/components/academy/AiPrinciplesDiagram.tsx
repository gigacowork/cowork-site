import styles from "./ai-principles-diagram.module.css";

type DiagramKind = "network" | "training" | "inference";

const networkVariants = [
  {
    title: "Фото",
    steps: [
      { eyebrow: "01 · что получает", title: "Фото посылки", detail: "На коробке видна вмятина" },
      { eyebrow: "02 · что делает", title: "Признаки повреждения", detail: "Сопоставляет детали с примерами" },
      { eyebrow: "03 · что выдаёт", title: "Нужна проверка", detail: "Помечает посылку для осмотра" },
    ],
  },
  {
    title: "Текст",
    steps: [
      { eyebrow: "01 · что получает", title: "Сообщение клиента", detail: "«Когда привезут заказ?»" },
      { eyebrow: "02 · что делает", title: "Слова и их связь", detail: "Учитывает, о чём говорится в сообщении" },
      { eyebrow: "03 · что выдаёт", title: "Тема: доставка", detail: "Определяет тему сообщения" },
    ],
  },
] as const;

const diagrams: Record<Exclude<DiagramKind, "network">, {
  label: string;
  steps: { eyebrow: string; title: string; detail: string }[];
  note: string;
}> = {
  training: {
    label: "Упрощённая схема обучения модели",
    steps: [
      { eyebrow: "01 · вход", title: "Примеры", detail: "Сообщение и известная тема" },
      { eyebrow: "02 · попытка", title: "Предположение", detail: "Модель предлагает тему" },
      { eyebrow: "03 · сравнение", title: "Разница", detail: "Ответ сравнивают с примером" },
      { eyebrow: "04 · настройка", title: "Параметры", detail: "Их изменяют и повторяют цикл" },
    ],
    note: "Цикл повторяется на множестве примеров. Так появляется обученная модель.",
  },
  inference: {
    label: "Упрощённая схема работы с новым запросом",
    steps: [
      { eyebrow: "01 · вход", title: "Новый запрос", detail: "И доступный для задачи контекст" },
      { eyebrow: "02 · обработка", title: "Обученная модель", detail: "Применяет изученные закономерности" },
      { eyebrow: "03 · выход", title: "Результат", detail: "Категория, прогноз или новый текст" },
    ],
    note: "На этом этапе модель использует готовые параметры. Обычный запрос не повторяет обучение.",
  },
};

export default function AiPrinciplesDiagram({ kind }: { kind: DiagramKind }) {
  if (kind === "network") {
    return (
      <figure className="rounded-24 border border-border-subtle bg-[linear-gradient(232.657deg,rgb(240,248,255)_20.714%,rgb(247,247,248)_94.867%)] p-16 md:p-24" aria-label="Как модель обрабатывает фото и текст">
        <figcaption className="mb-16 text-body-m font-medium text-text-primary">Как модель работает с фото и текстом</figcaption>
        <div className={styles.networkVariants}>
          {networkVariants.map((variant) => (
            <section key={variant.title} className={styles.networkVariant} aria-label={variant.title}>
              <h3 className={styles.variantTitle}>{variant.title}</h3>
              <div className={styles.steps} style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
                {variant.steps.map((step, index) => (
                  <div key={step.eyebrow} className={styles.step}>
                    <div className="flex min-w-0 flex-1 flex-col gap-8 rounded-16 border border-border-subtle bg-neutral-0 p-16">
                      <span className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">{step.eyebrow}</span>
                      <strong className="text-body-l font-medium text-text-primary">{step.title}</strong>
                      <span className="text-body-m text-text-secondary">{step.detail}</span>
                    </div>
                    {index < variant.steps.length - 1 ? <span aria-hidden="true" className={styles.arrow}>→</span> : null}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-16 text-body-m text-text-secondary">Модель не видит и не читает как человек: она применяет изученные закономерности к новому вводу.</p>
      </figure>
    );
  }

  const diagram = diagrams[kind];

  return (
    <figure className="rounded-24 border border-border-subtle bg-[linear-gradient(232.657deg,rgb(240,248,255)_20.714%,rgb(247,247,248)_94.867%)] p-16 md:p-24" aria-label={diagram.label}>
      <figcaption className="mb-16 text-body-m font-medium text-text-primary">{diagram.label}</figcaption>
      <div className={styles.steps} style={{ gridTemplateColumns: `repeat(${diagram.steps.length}, minmax(0, 1fr))` }}>
        {diagram.steps.map((step, index) => (
          <div key={step.eyebrow} className={styles.step}>
            <div className="flex min-w-0 flex-1 flex-col gap-8 rounded-16 border border-border-subtle bg-neutral-0 p-16">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">{step.eyebrow}</span>
              <strong className="text-body-l font-medium text-text-primary">{step.title}</strong>
              <span className="text-body-m text-text-secondary">{step.detail}</span>
            </div>
            {index < diagram.steps.length - 1 ? (
              <span aria-hidden="true" className={styles.arrow}>→</span>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-16 text-body-m text-text-secondary">{diagram.note}</p>
    </figure>
  );
}
