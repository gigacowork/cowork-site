import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(".");
const [digest, pageCss, clientJs, kommersantLogo, gigacoworkLogo, checkIcon] = await Promise.all([
  readFile(resolve(root, "src/data/kommersant-share.json"), "utf8"),
  readFile(resolve(root, "src/app/(promo)/kommersant-promo-dashboard/dashboard-chat.module.css"), "utf8"),
  readFile(resolve(root, "scripts/kommersant-dashboard-chat-client.js"), "utf8"),
  readFile(resolve(root, "public/img/kommersant-promo-v2/logo-kommersant.svg"), "utf8"),
  readFile(resolve(root, "public/img/kommersant-promo/logo-figma.svg"), "utf8"),
  readFile(resolve(root, "public/img/kommersant-promo/check-figma.svg"), "utf8"),
]);

const initialDigest = JSON.stringify(JSON.parse(digest)).replace(/</g, "\\u003c");
const prompt = "Открой kommersant.ru, найди значимые бизнес-события за последние 24 часа и собери тематический дайджест";
const steps = [
  ["Прочитал открытые источники", "Лента + рубрики «Экономика», «Бизнес», «Финансы», «Потребительский рынок», «Телекоммуникации»"],
  ["Отобрал ключевые события", "14 значимых событий за 24 часа, каждое проверено по прямой публикации"],
  ["Сгруппировал по темам", "Регулирование, технологии, энергетика, компании, потребительский рынок"],
  ["Собрал дайджест", "С описаниями, приоритетами и прямыми ссылками на «Ъ»"],
];

const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Что нового на kommersant.ru?</title>
  <meta name="description" content="Бизнес-дайджест свежих новостей, собранных ИИ-агентом GigaCowork">
  <style>
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; }
    [hidden] { display: none !important; }
    button, a { font: inherit; }
    button { cursor: pointer; }
    h1, h2, h3, h4, p, ol { margin: 0; }
    ${pageCss}
  </style>
</head>
<body>
  <main class="page" data-kommersant-promo aria-label="Дайджест GigaCowork в формате чата">
    <header class="brandPair" role="img" aria-label="Коммерсантъ и GigaCowork">${kommersantLogo}<span aria-hidden="true">×</span>${gigacoworkLogo}</header>
    <div class="content">
      <div class="hero"><h1>Что нового на kommersant.ru?</h1><p>Бизнес-дайджест свежих новостей, собранных ИИ-агентом GigaCowork</p></div>
      <div id="composer" class="composer" aria-label="Агент вводит запрос">
        <p><span id="composer-text" class="placeholder">Чем я могу помочь?</span><span class="caret" aria-hidden="true"></span></p>
        <div class="composerActions" aria-hidden="true"><span>＋</span><span>Агент⌄</span><span class="sendIcon">↑</span></div>
        <div class="connectorRow">${gigacoworkLogo}<span>+ 40 коннекторов</span></div>
      </div>
      <div id="thread" class="thread" aria-live="polite" hidden>
        <div class="userMessage">${prompt}</div>
        <div class="agentIdentity"><span class="agentAvatar" aria-hidden="true">✦</span><span>Агент GigaCowork</span></div>
        <section class="stepsBlock" aria-labelledby="agent-steps-title">
          <h2 id="agent-steps-title">Как агент выполнил задачу</h2>
          <ol id="steps" class="steps">${steps.map(([title, detail]) => `
            <li class="step" hidden>${checkIcon}<div><strong>${title}</strong><p>${detail}</p></div></li>`).join("")}</ol>
        </section>
        <section id="digest-result" class="digest" aria-labelledby="digest-title" hidden></section>
        <p id="digest-caption" class="caption" hidden></p>
        <div id="digest-cta" class="cta" hidden><p>Проверьте GigaCowork на своих задачах 7 дней бесплатно</p><a href="./lead/">Поручить задачу агенту</a></div>
      </div>
    </div>
  </main>
  <script id="initial-digest" type="application/json">${initialDigest}</script>
  <script>${clientJs}</script>
</body>
</html>
`;

const output = resolve(root, "public/kommersant-promo-dashboard.html");
await writeFile(output, html);
await writeFile(resolve(root, "public/kommersant-promo.html"), `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex,nofollow">
  <meta http-equiv="refresh" content="0;url=./kommersant-promo-dashboard.html">
  <title>Дашборд Коммерсанта переехал</title>
</head>
<body><p>Дашборд переехал на <a href="./kommersant-promo-dashboard.html">новый адрес</a>.</p></body>
</html>
`);
console.log(`Kommersant: создан отдельный HTML-файл ${output}`);
