# Ассеты

## Иконки — вытащены, ничего присылать не нужно

Скачать их по HTTP из моего окружения было нельзя (`www.figma.com` режется прокси,
`CONNECT 403`), но оказалось, что это и не требуется: плагин-API Figma умеет отдавать вектор
строкой прямо в ответе инструмента —

```js
await node.exportAsync({ format: "SVG_STRING" })
```

Это настоящие данные из файла, не перерисовка. Так забраны все 12 иконок:

| Файл | Слой в Figma | node-id |
|---|---|---|
| `public/img/icons/arrow-next.svg` | `Arrow / Next` | `802:3896` |
| `public/img/icons/arrow-up-right.svg` | `Icon` (стрелка ↗) | `418:4735` |
| `public/img/icons/factory.svg` | `Icon=factory` | `1137:3027` |
| `public/img/icons/users-round.svg` | `Icon=users-round` | `354:304` |
| `public/img/icons/car-front.svg` | `Icon=car-front` | `1137:3036` |
| `public/img/icons/chart-no-axes-combined.svg` | `Icon=chart-no-axes-combined` | `354:195` |
| `public/img/icons/money.svg` | `Icon=Money` | `868:6409` |
| `public/img/icons/thumbs-up.svg` | `Icon=thumbs-up` | `354:454` |
| `public/img/icons/bot.svg` | `Icon=bot` | `826:6909` |
| `public/img/team/icon-cloud.svg` | `Icon=cloud` | `1493:8185` |
| `public/img/team/icon-component.svg` | `Icon=component` | `354:167` |
| `public/img/team/icon-model.svg` | `Icon=model` | `354:225` |

Стрелка «назад» отдельным файлом не нужна: в Figma `Carousel Control` рисует Previous тем же
глифом, повёрнутым на 180° — так же сделано и в коде.

### Как они подключены

Цвета в файлах заменены на `currentColor`, а рендерятся иконки через `src/components/ui/Icon.tsx`
как CSS-маска поверх `bg-current`. Это нужно, чтобы цвет брался из токенов и менялся вместе с
состоянием: например, стрелка карусели переключается с `icon-primary` на `icon-secondary`, когда
кнопка неактивна. Через `<img>` так сделать нельзя.

## Что всё ещё нужно от вас

Ничего — все ассеты на месте.

Последним закрылся фон секции «Сделайте ИИ-агентов частью команды»: файл
«BG Сделайте ИИ-агентов частью команды.png» (2160×1038 = 1.5× фрейма `1927:15604`)
лежит в проекте как `public/img/team/section-bg.png` и заменил собой прежнюю сборку
из градиентов. На мобиле кадрируется по левому краю, на десктопе по центру.

Кнопка отправки `SendButton` (`360:610`) не понадобилась: композер из hero убран по вашей правке.

---

## Закрытые вопросы

**Шрифт крупных цифр.** На странице дизайн-системы (`457:2`) подписи под образцами прямо говорят
`Display/XL · SB Sans Text Regular · 160px` и `Display/L · SB Sans Text Regular · 96px`. Сами образцы
отрисованы подставленным Inter — артефакт файла. В проекте цифры набраны **SB Sans Text Regular**.

Межстрочный у Display/XL и Display/L в переменных читается неоднозначно (`100` без единиц), поэтому
взят из измерения фрейма метрик `1927:15594`: он ровно 376px = 64 + 193.6 + 16 + 38.4 + 64,
то есть 193.6 / 160 = **1.21**.

---

## Состояния компонентов — сверено с макетом

**Carousel Control (`802:3907`) и Carousel Navigation (`804:3916`)**:

| Состояние | Фон | Граница |
|---|---|---|
| Default | `action-secondary-default` #ffffff | `border-default` #d4d9e0 |
| Hover | `action-secondary-hover` #f7f8fa | `border-strong` #3a4048 |
| Pressed | `action-secondary-pressed` #e6e9ed | `border-strong` #3a4048 |
| Disabled | `action-secondary-disabled` #f1f3f5 | `border-subtle` #e6e9ed |

Ряд — 120×44, gap 8. Position=Start / Middle / End переключается автоматически по реальной позиции
карусели. Токен `--color-action-secondary-pressed` (#e6e9ed) добавлен в `@theme` — он встречается
только здесь.

**Button (`316:985`)** — 27 вариантов (Type × Size × State), состояния Pressed у кнопки нет:

| Size | Паддинги | Кегль | Высота |
|---|---|---|---|
| Large | px-24 / py-12 | 14px | 41 |
| Medium | px-24 / py-8 | 14px | 33 |
| Small | px-16 / py-8 | 12px | 30 |

| Type | Default | Hover | Disabled |
|---|---|---|---|
| Primary | bg #171f2d, текст #fff | bg #384251 | bg #e6e9ed, текст #8c949e |
| Secondary | bg #fff, граница #3a4048 | bg #f7f8fa | граница #e6e9ed, текст #8c949e |
| Ghost | bg #fff | bg #f7f8fa | текст #8c949e |
