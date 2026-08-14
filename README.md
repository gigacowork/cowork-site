# Cowork.ru — главная страница

Вёрстка главной по макетам Figma (`o8OtIvYjYSo8N7W6N7VKnB`).

**Стек:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (CSS-first `@theme`, без `tailwind.config.js`).

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Структура

```
src/
  app/
    globals.css              — @font-face, все дизайн-токены из Figma (@theme), базовые стили
    layout.tsx
    page.tsx                 — сборка страницы из секций
  components/
    ui/Button.tsx            — компонент Button из макета (primary / secondary / ghost · sm / md / lg)
    sections/                — 11 секций, по файлу на секцию
      Header.tsx             1927:15642  / 1927:17444
      Hero.tsx               1927:15554  / 1927:17359
      NoHours.tsx            1927:15563  / 1927:17369
      Clients.tsx            1927:15582  / 1927:17385
      HowAgentsWork.tsx      2006:8925   / 1927:17394
      Metrics.tsx            1927:15594  / 1927:17400
      UnlimitedTokens.tsx    2061:9010   / 1927:17404
      PartOfTeam.tsx         1927:15604  / 1927:17410
      Cases.tsx              1927:15614  / 1927:17417
      Infrastructure.tsx     1927:15624  / 1927:17426
      FinalCta.tsx           2569:43352  / 2569:43383
      Footer.tsx             1927:15641  / 1927:17443
    interactive/             — слой анимаций, надстроен над секциями, ничего в них не меняет
      HeroWithChat.tsx       — hero со встроенным чатом
      HeroChat.tsx           — встроенный чат: список сообщений ↑ композер ↓ сценарии
      HorizontalScrollCards.tsx — вертикальный скролл → горизонтальная прокрутка карточек
      StackingCards.tsx      — наложение карточек по мере скролла
      CountUp.tsx            — counter-анимация крупных цифр
public/
  fonts/                     — SB Sans Text / Display / Caps, Druk Wide Cyr (woff2)
  img/                       — ассеты из папки «Image fore Home»
```

## Дизайн-токены

Все значения взяты из Figma через `get_variable_defs`, ничего не подбиралось на глаз.
Определены в `src/app/globals.css` в блоке `@theme`:

- цвета: `text-primary #171f2d`, `text-secondary #3a4048`, `border-subtle #e6e9ed`,
  `border-default #d4d9e0`, `border-strong #3a4048`, `action-primary-default #171f2d`,
  `action-primary-hover #384251`, `neutral-0/50/100/1000`, `bg-tag #ffffffb2`, `status-success #00aa00`;
- отступы: 4 8 12 16 24 32 40 48 64 80 96 120;
- радиусы: 12 16 24 full;
- типографика: `text-display-xl` 160/100, `text-display-l` 96/100, `text-h1` 48, `text-h2` 36,
  `text-h3` 25, `text-h4` 20, `text-body-l` 16, `text-body-m` 14, `text-caption` 12
  (все — SB Sans Text, line-height 1.2, tracking −0.02em);
- layout: контент 1200 + поля 120 (desktop 1440) / 40 (tablet 768) / 16 (mobile 390) — из Responsive-спеки 457:2 — утилита `.container-page`;
- тени: `shadow-elevation-lg` `0 12px 48px -8px #60738f33`.

## Адаптив

Mobile-first, переключатель `md:` = 768px. База — мобильный фрейм (390), `md:` — десктопный (1440).
В мобильном Hero, как в макете, нет чат-композера и списка сценариев.

## Интерактив

| Требование | Реализация |
|---|---|
| Клик по чипсу запускает чат | `HeroChat` (PROTO / Hero Chat · Embedded `1933:85345`). Чат **встроен в hero**, а не модалка, и композера в нём нет — только сообщение и ответы агента. Hero плавно тянется по высотам состояний Idle → Step 4. Сообщения появляются по одному с индикатором набора; после 4-го список упирается в максимум, включается скролл и верхние сообщения уходят в прозрачность градиентной маской |
| Заголовок «Как работают ИИ-агенты» остаётся видимым | Закреплён над стопкой и отпускается ровно вместе с последней карточкой (`StackingCards`) |
| Навигация прозрачна над hero | `Header` следит за живым нижним краем hero, а не за фиксированным отступом — hero растёт при запуске чата, и подложка это учитывает |
| Вертикальный скролл в блоке «Не тратьте часы…» переходит в горизонтальную прокрутку карточек | `HorizontalScrollCards`: секция пинится (`sticky`), трек двигается `translate3d` пропорционально прогрессу скролла; после последней карточки страница едет дальше вниз |
| Карточки «Как работают ИИ-агенты» накладываются друг на друга при скролле | `StackingCards`: каждая карточка `sticky` со смещением 0/40/80px (значения из макета), предыдущие ужимаются до 0.942 / 0.971 |
| Крупные цифры в блоке метрик считаются от 0 | `CountUp`: IntersectionObserver + rAF, ease-out 1.4s, ширина зафиксирована — layout не прыгает |

Все эффекты — прогрессивное улучшение: работают только на `md+`, отключаются при
`prefers-reduced-motion: reduce`, и без JS страница остаётся полностью читаемой
(цифры сразу показывают финальные значения, карточки листаются нативным свайпом).

## Состояния компонентов

Разобраны по макету и сведены в `ASSETS-TODO.md`:

- **Button** (`316:985`) — Type × Size × State, 27 вариантов. Large и Medium набраны 14px,
  Small — 12px; высоты 41 / 33 / 30 совпадают с макетом.
- **Carousel Control** (`802:3907`) — Default / Hover / Pressed / Disabled, и ряд
  **Carousel Navigation** (`804:3916`) с позициями Start / Middle / End: неактивная стрелка
  переключается по реальной позиции карусели.
- **Card / Info** (`1312:4755`) — Default без тени, Hover `Elevation/Drop/Lg`,
  Pressed `Elevation/Drop/Sm`. Применено к кликабельным карточкам: все 9 в «Не тратьте часы»,
  все 3 в «Опыте клиентов» и две правые в «Частью команды».

Кликабельные карточки используют растянутую зону клика: кликается вся карточка, но
интерактивный элемент внутри один, поэтому разметка валидна и доступна с клавиатуры.
Адреса ссылок пока заглушки (`#more`, `#case`) — их нужно проставить.

## Ассеты

Все на месте, включая иконки — они выгружены из Figma через плагин-API
(`node.exportAsync({ format: "SVG_STRING" })`), это настоящий вектор из файла.
Подробности и таблица соответствий — в `ASSETS-TODO.md`.
