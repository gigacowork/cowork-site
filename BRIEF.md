# Project brief for section implementers

Project root: `/home/claude/cowork-site`
Stack: **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4** (CSS-first `@theme`, no tailwind.config.js).

## Non-negotiable workflow

1. Load the Figma design-to-code skill guidance is ALREADY assumed — just always pass
   `skillNames: "figma-design-to-code"` to `get_design_context`.
2. For your section call `mcp__Figma__get_design_context` **on your own node-id** — desktop AND mobile,
   separately. `fileKey` = `o8OtIvYjYSo8N7W6N7VKnB`.
3. Also call `mcp__Figma__get_variable_defs` on the same nodes and use the REAL values.
4. Take ALL текст (заголовки, подписи, лейблы) verbatim from the Figma code output. Never from memory,
   never invented, never translated.
5. If `get_design_context` errors — DO NOT guess from the screenshot. Report the failing node id back.
6. After writing the component, call `mcp__Figma__get_screenshot` on the same node and explicitly list
   what matches and what does not.

## Design tokens — ALREADY DEFINED in `src/app/globals.css` (`@theme`). Use these, do not hardcode hex.

Colors (Tailwind classes): `text-text-primary` `#171f2d`, `text-text-secondary` `#3a4048`,
`text-text-inverse` `#fff`, `bg-neutral-0` `#fff`, `bg-neutral-50` `#f7f8fa`, `bg-neutral-100` `#f1f3f5`,
`bg-neutral-1000` `#000`, `bg-neutral-0-a70` `#ffffffb2`, `border-border-subtle` `#e6e9ed`,
`border-border-default` `#d4d9e0`, `border-border-strong` `#3a4048`,
`bg-action-primary-default` `#171f2d`, `bg-action-primary-hover` `#384251`,
`bg-action-secondary-default` `#fff`, `bg-action-secondary-disabled` `#f1f3f5`,
`bg-bg-page` / `bg-bg-card` `#fff`, `bg-bg-tag` `#ffffffb2`, `text-icon-primary` `#171f2d`,
`text-icon-secondary` `#8c949e`, `bg-brand-dark` `#171f2d`, `text-status-success` `#00aa00`.

Spacing (px-based scale, use as `p-24`, `gap-16`, `mt-80`…): 4 8 12 16 24 32 40 48 64 80 96 120.
Radii: `rounded-[12px]` → use `rounded-12` is NOT defined; use `rounded-[12px]`, `rounded-[16px]`,
`rounded-[24px]`, `rounded-full`.

Typography utilities (already in `@theme`, include size+line-height+tracking):
`text-display-xl` (160/100), `text-display-l` (96/100), `text-h1` (48), `text-h2` (36), `text-h3` (25),
`text-h4` (20), `text-body-l` (16), `text-body-m` (14), `text-caption` (12).
All headings are SB Sans Text **Medium (font-medium / weight 500)**, line-height 1.2, tracking -0.02em.
Fonts available: `font-sans` (SB Sans Text, default), `font-display` (SB Sans Display),
`font-caps` (SB Sans Text Caps), `font-druk` (Druk Wide Cyr).

Shadows: `shadow-elevation-lg` (`0 12px 48px -8px #60738f33`), `shadow-elevation-xs`.

Layout: use the `.container-page` utility (max-width 1200 + page padding: 20px mobile / 40px ≥768 /
120px ≥1200). Desktop artboard is 1440, mobile artboard 390.

## Breakpoints

Mobile-first. `md:` (768px) is the desktop/mobile switch — mobile Figma frame drives the base styles,
desktop Figma frame drives `md:` overrides. Where a mobile frame omits a block entirely, render it
`hidden md:block` (or don't render it at all if it is desktop-only content).

## Existing shared components — REUSE, do not re-create

- `@/components/ui/Button` — `<Button variant="primary|secondary|ghost" size="sm|md|lg" href?="">`
  Matches the Figma Button component (rounded-full, px-24/py-8, primary #171f2d / secondary bordered).
- `@/components/sections/Header` — done, use as the reference for code style.

## Local assets — ALREADY in `public/img/`. Use `next/image` with these paths. NEVER hand-draw an SVG icon.

```
/img/logo-gigacowork.svg            155×33  (header logo)
/img/bkg.png                                (page/hero background)
/img/clients/bi-group.svg
/img/clients/directum.svg
/img/clients/frank-auto.svg
/img/clients/phosagro.svg
/img/clients/sber-auto.svg
/img/agents/receive.png             "Получают задачу от сотрудников"
/img/agents/analyze.png             "Анализируют и структурируют данные"
/img/agents/result.png              "Выдают результат"
/img/tokens/no-limits.png           "Без ограничений по количеству задач"
/img/tokens/per-user.png            "Тарификация по пользователям"
/img/team/app-preview.png
/img/team/app-preview-1.png
/img/team/app-preview-2.png
/img/cases/bi-group.svg
/img/cases/phosagro.svg
/img/cases/frank-auto.svg
/img/infra/sber.svg
/img/footer/logo-gigacowork.svg     161×34
/img/footer/telegram.svg
```

If your section needs an icon/image that is NOT in this list: do **not** invent it and do **not** inline
a hand-written `<svg>`. Instead, for small UI glyphs (chevrons, arrows, checkmarks, close) you MAY use a
neutral geometric shape built from the Figma vector data ONLY if `get_design_context` returned explicit
geometry; otherwise add it to your "assets to export" list in the report and leave a sized empty
placeholder box with a `{/* TODO asset: <name> */}` comment.

## Code conventions

- One file per section: `src/components/sections/<Name>.tsx`, default export + named export.
- Add `"use client"` only when the component needs state/effects.
- Header the file with a comment listing the Figma node ids (desktop + mobile).
- Semantic HTML: `<section>`, `<h2>`, `<ul>/<li>`, `<button>`, `alt` on every image.
- Keep `data-node-id` OUT of the final code.
- Do not install packages. Do not create a `tailwind.config.js`.
- Do NOT edit `src/app/page.tsx`, `globals.css`, or other people's section files — only your own file.
- After writing, run `npx tsc --noEmit -p /home/claude/cowork-site` to confirm your file typechecks
  (ignore errors coming from files other than yours).

## Report back (this is your return value — keep it under 40 lines)

```
SECTION: <name>  FILE: src/components/sections/<Name>.tsx  EXPORT: <ComponentName>
NODES OK: desktop <id> / mobile <id>   (or NODE FAILED: <id> — <error>)
MATCHES: <bullet list of what is faithful to the mock>
DIFFERS: <bullet list of anything you could not reproduce exactly, and why>
ASSETS NEEDED: <list of assets that must be exported from Figma, or "none">
INTERACTIVE HOOKS: <what you exposed for the animation work, or "none">
```
