"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";

const stages = [
  {
    label: "Агент",
    title: "Подключите агента под задачу",
    text: "У нового пользователя список агентов пуст. Когда появится повторяющаяся задача, добавьте готового помощника из Витрины или создайте своего, затем выберите его в чате.",
    actions: ["Откройте список агентов", "Добавьте агента из Витрины или создайте своего", "Проверьте его на знакомой задаче"],
    guide: "/guides/#agents",
    guideLabel: "Видео об агентах",
  },
  {
    label: "Навык",
    title: "Создайте навык для повторяющейся задачи",
    text: "Навык хранит повторно используемую инструкцию. Опишите, когда её применять, какие действия выполнить и как проверить результат. Затем испытайте навык на примере.",
    actions: ["Выберите задачу, которая повторяется", "Опишите шаги и критерии результата", "Проверьте навык и уточните инструкцию"],
    guide: "/guides/#skills",
    guideLabel: "Видео о навыках",
  },
  {
    label: "Команда",
    title: "Создайте команду для быстрого запуска",
    text: "Команда превращает рабочий запрос в короткое действие. Сохраните название и инструкцию, а в следующий раз вызовите команду через «/» в чате.",
    actions: ["Возьмите проверенный запрос", "Сохраните его как быструю команду", "Запускайте команду через «/»"],
    guide: "/guides/#quick-commands",
    guideLabel: "Видео о командах",
  },
] as const;

function AgentScreen() {
  return <div className="mx-auto flex w-full max-w-[460px] flex-col gap-16">
    <div className="rounded-16 border border-border-subtle bg-bg-card p-24 shadow-drop-sm">
      <div className="flex items-center justify-between border-b border-border-subtle pb-16"><b className="text-body-l">Агенты</b><span className="text-caption text-text-tertiary">0 подключено</span></div>
      <div className="flex flex-col items-center gap-8 py-24 text-center"><span className="flex size-[36px] items-center justify-center rounded-full bg-neutral-100 text-body-l">@</span><b className="text-body-m">Пока нет агентов</b><span className="max-w-[280px] text-body-m text-text-secondary">Добавьте готового помощника или создайте агента под свою задачу</span></div>
      <div className="flex flex-wrap gap-8"><span className="rounded-full bg-action-primary-default px-16 py-8 text-body-m text-text-inverse">Добавить из Витрины</span><span className="rounded-full border border-border-strong bg-bg-card px-16 py-8 text-body-m">Создать агента</span></div>
    </div>
    <div className="flex items-center gap-12 rounded-12 border border-border-subtle bg-bg-card p-12"><span className="text-caption text-text-tertiary">ПОСЛЕ ДОБАВЛЕНИЯ</span><span className="ml-auto flex size-[25px] items-center justify-center rounded-full bg-[#e6ecff] text-caption font-semibold text-[#3454cc]">А</span><b className="text-body-m">Аналитика</b></div>
  </div>;
}

function SkillScreen() {
  return <div className="mx-auto w-full max-w-[460px] rounded-16 border border-border-subtle bg-bg-card p-24 shadow-drop-sm">
    <div className="flex items-center justify-between border-b border-border-subtle pb-16"><div className="flex items-center gap-8"><span className="flex size-[25px] items-center justify-center rounded-full bg-[#e6ecff] text-caption font-semibold text-[#3454cc]">А</span><b className="text-body-l">Аналитика</b></div><span className="text-caption text-text-tertiary">Навыки</span></div>
    <div className="mt-24 rounded-12 border border-border-subtle bg-[#fafafa] p-16"><span className="text-caption text-text-tertiary">НАВЫК</span><b className="mt-8 block text-body-l">Сравнение предложений</b><p className="mt-8 text-body-m text-text-secondary">Когда: получены два или больше КП.<br />Как: сравнить цену, сроки и условия.<br />Результат: таблица и вопросы для проверки.</p></div>
    <div className="mt-16 inline-flex rounded-full border border-border-strong px-16 py-8 text-body-m">+ Создать навык</div>
  </div>;
}

function CommandScreen() {
  return <div className="mx-auto w-full max-w-[460px] rounded-16 border border-border-subtle bg-bg-card p-24 shadow-drop-sm">
    <div className="flex items-center justify-between border-b border-border-subtle pb-16"><b className="text-body-l">Команды</b><span className="text-caption text-text-tertiary">Быстрый запуск</span></div>
    <div className="mt-24 rounded-12 border border-border-subtle bg-[#fafafa] p-16"><span className="text-caption text-text-tertiary">СОХРАНЁННАЯ КОМАНДА</span><b className="mt-8 block text-body-l">/сравнить-кп</b><p className="mt-8 text-body-m text-text-secondary">Сравнить предложения по цене, срокам и условиям; перечислить, что нужно уточнить.</p></div>
    <div className="mt-16 rounded-12 border border-border-subtle p-16 text-body-m"><span className="text-text-secondary">Введите команду в чате</span><span className="mt-8 block font-medium">/сравнить-кп</span></div>
  </div>;
}

export default function AdvancedProcess() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  return <section id="next-level" className="w-full scroll-mt-[calc(var(--header-h)+24px)] bg-bg-page py-64 md:py-96">
    <div className="container-page flex flex-col gap-32 md:gap-48">
      <div className="flex max-w-[800px] flex-col gap-16"><Kicker>Следующий уровень</Kicker><h2 className="text-h3 font-medium text-text-primary md:text-h2">Когда первая задача получилась</h2><p className="text-body-l text-text-secondary">Теперь можно настроить повторяющуюся работу: подключить агента, дать ему навык и сохранить удобный запуск как команду. Это отдельный процесс, который не нужен для первого запроса.</p></div>
      <nav aria-label="Этапы настройки повторяющейся работы" className="flex flex-wrap gap-12">{stages.map((item, index) => <Button key={item.label} variant={active === index ? "primary" : "secondary"} size="lg" aria-pressed={active === index} onClick={() => setActive(index)}>{String(index + 1).padStart(2, "0")}&nbsp; {item.label}</Button>)}</nav>
      <div className="grid overflow-hidden rounded-24 border border-border-subtle bg-bg-card shadow-drop-sm lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        <div className="flex flex-col items-start gap-16 p-24 md:p-40"><span className="text-caption text-text-tertiary">ЭТАП {String(active + 1).padStart(2, "0")}</span><h3 className="text-h4 font-medium text-text-primary md:text-h3">{stage.title}</h3><p className="text-body-l text-text-secondary">{stage.text}</p><ol className="mt-8 flex flex-col gap-12">{stage.actions.map((action, index) => <li key={action} className="flex gap-12 text-body-m"><span className="text-text-tertiary">{index + 1}.</span><span>{action}</span></li>)}</ol><div className="mt-16 flex flex-wrap gap-12"><Button href={stage.guide} variant="secondary" size="md">{stage.guideLabel}</Button>{active === 0 && <Button href="/ai-platform/agents" variant="ghost" size="md">Об агентах</Button>}</div></div>
        <div className="flex min-h-[390px] items-center justify-center border-t border-border-subtle bg-[linear-gradient(145deg,#f4f8ff,#e9f8f5)] p-16 md:p-32 lg:border-t-0 lg:border-l">{active === 0 ? <AgentScreen /> : active === 1 ? <SkillScreen /> : <CommandScreen />}</div>
      </div>
    </div>
  </section>;
}
