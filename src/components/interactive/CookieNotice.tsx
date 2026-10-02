"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "cowork-cookie-notice-dismissed";
const PRIVACY_POLICY_URL = "https://cowork.ru/legal/politika_konfidentsialnosti.pdf";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Баннер всё равно можно закрыть, если браузер блокирует хранилище.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Уведомление о cookie"
      className="fixed right-16 bottom-16 left-16 z-[90] mx-auto flex max-w-[1200px] flex-col gap-24 rounded-24 border border-border-subtle bg-bg-page p-24 shadow-[0_12px_48px_rgba(23,31,45,0.18)] md:bottom-24 md:flex-row md:items-center md:p-32"
    >
      <p className="flex-1 text-body-m leading-[1.5] text-text-primary">
        Мы обрабатываем cookie-файлы для персонализации сервисов и для того,
        чтобы пользоваться сайтом было удобнее. Вы можете запретить обработку
        cookie-файлов в настройках браузера. Продолжая использование сайта, Вы
        соглашаетесь с{" "}
        <a
          href={PRIVACY_POLICY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-action-primary-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
        >
          Политикой конфиденциальности
        </a>
        .
      </p>
      <Button onClick={dismiss} size="lg" className="w-full shrink-0 md:w-auto">
        Понятно
      </Button>
    </aside>
  );
}
