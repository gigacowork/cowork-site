import Icon from "@/components/ui/Icon";
import styles from "./ScenarioDemo.module.css";

export const customerRequestPhase = {
  reviewDeal: 4,
  confirmDeal: 5,
  createDeal: 6,
  reviewEmail: 7,
  confirmEmail: 8,
  sendEmail: 9,
} as const;

const actions = [
  {
    title: "Карточка сделки в amoCRM",
    details: <>
      <p><strong>Карточки для меню</strong> · Анна Лапина, кафе «Корица и мёд»</p>
      <p>300 двусторонних карточек меню А6 к 20 ноября. Макет в PDF, самовывоз.</p>
    </>,
    question: "Создать новую сделку?",
    confirmation: "Да, создать",
    done: "Сделка создана",
    reviewAt: customerRequestPhase.reviewDeal,
    confirmAt: customerRequestPhase.confirmDeal,
    doneAt: customerRequestPhase.createDeal,
  },
  {
    title: "Письмо в Mail Почте",
    details: <>
      <p><strong>Кому:</strong> Анна Лапина · <strong>Тема:</strong> Карточки для меню</p>
      <p>Анна, здравствуйте! Подскажите, какую бумагу выбрать и нужна ли цветная печать с обеих сторон? Затем рассчитаем стоимость и проверим, успеем ли к 20 ноября.</p>
    </>,
    question: "Отправить письмо клиенту?",
    confirmation: "Да, отправить",
    done: "Письмо отправлено",
    reviewAt: customerRequestPhase.reviewEmail,
    confirmAt: customerRequestPhase.confirmEmail,
    doneAt: customerRequestPhase.sendEmail,
  },
];

export function CustomerRequestResult({ phase }: { phase: number }) {
  if (phase < 3) return null;

  return <>
    <p className={styles.reasoning}>В amoCRM это новая заявка. Для расчёта нужно уточнить бумагу и цветность.</p>
    {phase >= customerRequestPhase.reviewDeal && (
      <div className={styles.customerActions}>
        {actions.filter(({ reviewAt }) => phase >= reviewAt).map((action) => (
          <section key={action.title} className={styles.customerAction} aria-label={action.title}>
            <h3>{action.title}</h3>
            <div className={styles.customerActionDetails}>{action.details}</div>
            <div className={styles.customerActionDecision}>
              <p className={styles.customerActionQuestion}>{action.question}</p>
              {phase >= action.confirmAt && (
                <p className={styles.customerActionConfirmation}>
                  <span>{action.confirmation}</span> Автоподтверждение
                </p>
              )}
              {phase >= action.doneAt && (
                <p className={styles.customerActionDone}>
                  <Icon src="/img/icons/check.svg" className="size-[18px] shrink-0" />
                  {action.done}
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    )}
  </>;
}
