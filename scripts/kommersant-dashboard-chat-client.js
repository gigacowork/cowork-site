(() => {
  const snapshot = document.getElementById("initial-digest");
  const composer = document.getElementById("composer");
  const composerText = document.getElementById("composer-text");
  const thread = document.getElementById("thread");
  const result = document.getElementById("digest-result");
  const caption = document.getElementById("digest-caption");
  const steps = [...document.querySelectorAll("#steps > li")];
  if (!snapshot || !composer || !composerText || !thread || !result || !caption) return;

  const prompt = "Открой kommersant.ru, найди значимые бизнес-события за последние 24 часа и собери тематический дайджест";
  const topicOrder = [
    "Регулирование и налоги", "Макроэкономика и рынки", "Компании и инвестиции",
    "Потребительский рынок", "Технологии и связь", "Энергетика и промышленность",
    "Логистика и внешняя торговля",
  ];
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
  const formatDate = (value) => value && Number.isFinite(Date.parse(value)) ? formatter.format(new Date(value)) : null;
  const safeUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? escapeHtml(url.href) : "#";
    } catch { return "#"; }
  };
  const isDigest = (value) => value && value.version === 1
    && (value.status === "ok" || value.status === "waiting")
    && (value.sourceUrl === null || typeof value.sourceUrl === "string")
    && value.metrics && Array.isArray(value.items);

  let digest;
  try { digest = JSON.parse(snapshot.textContent); } catch { return; }
  if (!isDigest(digest)) return;
  let secondsToNextCheck = 300;

  const sharePage = location.protocol === "file:"
    ? "https://gigacowork.github.io/cowork-site/kommersant-promo-dashboard.html"
    : `${location.origin}${location.pathname}`;
  const shareTitle = "Что нового на kommersant.ru?";
  const shareLinks = [
    ["Telegram", `https://t.me/share/url?url=${encodeURIComponent(sharePage)}&text=${encodeURIComponent(shareTitle)}`],
    ["VK", `https://vk.com/share.php?url=${encodeURIComponent(sharePage)}`],
    ["MAX", `https://max.ru/:share?text=${encodeURIComponent(`${shareTitle} ${sharePage}`)}`],
  ];

  function render(data) {
    const selected = [...data.items].sort((a, b) => {
      const changed = (item) => item.changeStatus === "new" || item.changeStatus === "updated" ? 1 : 0;
      return changed(b) - changed(a)
        || Number(b.priority === "high") - Number(a.priority === "high")
        || Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    }).slice(0, 12);
    const grouped = new Map();
    for (const item of selected) grouped.set(item.primaryTopic, [...(grouped.get(item.primaryTopic) || []), item]);
    const sections = topicOrder.filter((topic) => grouped.has(topic))
      .map((title) => ({ title, items: grouped.get(title) }));
    const topicCounts = topicOrder.map((title) => ({
      title, count: data.items.filter((item) => item.primaryTopic === title).length,
    })).filter((topic) => topic.count > 0);
    const maxCount = Math.max(1, ...topicCounts.map((topic) => topic.count));
    const checkedAt = formatDate(data.digestCheckedAt);
    const siteCheckedAt = formatDate(data.siteCheckedAt);
    const isStale = data.digestCheckedAt && data.siteCheckedAt
      && Date.parse(data.siteCheckedAt) - Date.parse(data.digestCheckedAt) > 15 * 60 * 1000;
    const metrics = [
      [data.metrics.newSinceLastRun, "Новых с прошлого запуска"],
      [data.metrics.significant24h, "Значимых за 24 часа"],
      [data.metrics.highPriority24h, "Высокий приоритет"],
    ];

    result.innerHTML = `
      <div class="digestHeader">
        <div><p class="digestEyebrow">Результат работы агента</p><h2 id="digest-title">Бизнес-дайджест Ъ</h2>
          <p class="issueDate">${checkedAt ? `${isStale ? "Последний выпуск" : "Выпуск"} от ${escapeHtml(checkedAt)} МСК` : "Ожидаем первый выпуск из публичной сессии"}</p></div>
        <div class="shareControl"><button type="button" id="share-button" class="shareButton" aria-expanded="false" aria-controls="share-menu">Поделиться</button>
          <nav id="share-menu" class="shareMenu" aria-label="Поделиться страницей" hidden>${shareLinks.map(([name, href]) => `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${name}</a>`).join("")}</nav></div>
      </div>
      <div class="liveStatus" aria-live="off"><span class="onlineDot" aria-hidden="true"></span><span>Агент онлайн (обновление через <span id="next-check">05:00</span>)</span></div>
      <div class="metrics" aria-label="Показатели выпуска">${metrics.map(([value, label]) => `<div class="metric"><strong>${escapeHtml(value ?? "—")}</strong><span>${label}</span></div>`).join("")}</div>
      <div class="digestBody"><div class="news"><h3 id="kommersant-news-heading">Главное в выпуске</h3>${sections.length === 0
        ? `<p class="emptyNews">${data.status === "ok" ? "За последние 24 часа значимых событий не найдено." : "В публичной сессии пока нет подходящего выпуска."}</p>`
        : `<div class="newsList" role="region" aria-labelledby="kommersant-news-heading" tabindex="0">${sections.flatMap((section) => section.items.map((item) => `
          <article class="newsItem"><span class="newsTag">${escapeHtml(section.title)}</span>
            <h4><a href="${safeUrl(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a></h4>
            <p>${escapeHtml(item.summary)}</p><p><strong>Для бизнеса:</strong> ${escapeHtml(item.businessImpact)}</p>
            <span class="newsSource">${item.priority === "high" ? "Высокий" : "Обычный"} приоритет · ${escapeHtml(formatDate(item.publishedAt))} МСК${item.updatedAt ? ` · обновлено ${escapeHtml(formatDate(item.updatedAt))} МСК` : ""}${item.topicTags?.length || item.industryTags?.length ? ` · ${escapeHtml([...(item.topicTags || []), ...(item.industryTags || [])].join(" · "))}` : ""}</span>
          </article>`)).join("")}</div>`}</div>
        <aside class="agenda" aria-label="Повестка по темам"><h3>Повестка по темам</h3><p>все значимые события за 24 часа</p>
          <div class="agendaRows">${topicCounts.map((topic) => `<div class="agendaRow"><div><span>${escapeHtml(topic.title)}</span><strong>${topic.count}</strong></div><div class="agendaTrack"><span style="width:${topic.count / maxCount * 100}%"></span></div></div>`).join("")}</div>
        </aside></div>`;

    caption.innerHTML = `${data.sourceUrl
      ? `${data.status === "ok" ? "Выпуск получен из " : "Ожидается выпуск в "}<a href="${safeUrl(data.sourceUrl)}" target="_blank" rel="noopener noreferrer">публичной сессии GigaCowork</a>.`
      : "Публичная сессия для дайджеста пока не подключена."}
      ${checkedAt ? ` Агент проверил материалы ${escapeHtml(checkedAt)} МСК.` : ""}
      ${siteCheckedAt ? ` Сайт проверил сессию ${escapeHtml(siteCheckedAt)} МСК.` : ""}
      ${isStale ? " Новый выпуск задерживается; показан последний полученный." : ""}`;
    updateCountdown();
  }

  function updateCountdown() {
    const target = document.getElementById("next-check");
    if (target) target.textContent = `${String(Math.floor(secondsToNextCheck / 60)).padStart(2, "0")}:${String(secondsToNextCheck % 60).padStart(2, "0")}`;
  }

  result.addEventListener("click", (event) => {
    const button = document.getElementById("share-button");
    const menu = document.getElementById("share-menu");
    if (!button || !menu) return;
    if (event.target?.id === "share-button") {
      menu.hidden = !menu.hidden;
      button.setAttribute("aria-expanded", String(!menu.hidden));
    } else if (event.target?.closest("#share-menu a")) {
      menu.hidden = true;
      button.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (event.target?.closest(".shareControl")) return;
    const button = document.getElementById("share-button");
    const menu = document.getElementById("share-menu");
    if (button && menu) { menu.hidden = true; button.setAttribute("aria-expanded", "false"); }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const button = document.getElementById("share-button");
    const menu = document.getElementById("share-menu");
    if (button && menu) { menu.hidden = true; button.setAttribute("aria-expanded", "false"); }
  });

  render(digest);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    composer.hidden = true;
    thread.hidden = false;
    steps.forEach((step) => { step.hidden = false; });
    result.hidden = false;
    caption.hidden = false;
    document.getElementById("digest-cta").hidden = false;
  } else {
    let position = 0;
    setTimeout(() => {
      const typing = setInterval(() => {
        position = Math.min(prompt.length, position + 2);
        composerText.textContent = prompt.slice(0, position);
        composerText.classList.remove("placeholder");
        if (position === prompt.length) {
          clearInterval(typing);
          setTimeout(() => {
            composer.hidden = true;
            thread.hidden = false;
            steps.forEach((step, index) => setTimeout(() => { step.hidden = false; }, 300 + index * 450));
            setTimeout(() => {
              result.hidden = false;
              caption.hidden = false;
              document.getElementById("digest-cta").hidden = false;
            }, 300 + steps.length * 450);
          }, 350);
        }
      }, 32);
    }, 500);
  }

  if (location.protocol === "file:") {
    const status = result.querySelector(".liveStatus");
    if (status) status.textContent = "Обновления доступны на опубликованной странице";
  } else {
    setInterval(() => { secondsToNextCheck = Math.max(0, secondsToNextCheck - 1); updateCountdown(); }, 1000);
  }

  async function refresh() {
    if (location.protocol === "file:") return;
    secondsToNextCheck = 300;
    updateCountdown();
    try {
      const response = await fetch(`./data/kommersant-share.json?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) return;
      const latest = await response.json();
      if (!isDigest(latest)) return;
      const currentTime = Date.parse(digest.digestCheckedAt || "") || 0;
      const latestTime = Date.parse(latest.digestCheckedAt || "") || 0;
      if (latest.sourceUrl === digest.sourceUrl && latestTime < currentTime) return;
      digest = latest;
      render(digest);
    } catch { /* Keep the embedded snapshot on network errors. */ }
  }
  void refresh();
  setInterval(() => void refresh(), 5 * 60 * 1000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") void refresh(); });
})();
