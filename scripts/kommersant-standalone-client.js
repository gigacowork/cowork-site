(() => {
  const root = document.getElementById("digest-content");
  const caption = document.getElementById("digest-caption");
  const snapshot = document.getElementById("initial-digest");
  if (!root || !caption || !snapshot) return;

  const topicOrder = [
    "Регулирование и налоги",
    "Макроэкономика и рынки",
    "Компании и инвестиции",
    "Потребительский рынок",
    "Технологии и связь",
    "Энергетика и промышленность",
    "Логистика и внешняя торговля",
  ];
  const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
  const formatDate = (value) => value && Number.isFinite(Date.parse(value))
    ? dateFormatter.format(new Date(value))
    : null;
  const safeUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? escapeHtml(url.href) : "#";
    } catch {
      return "#";
    }
  };
  const isDigest = (value) => value && value.version === 1
    && (value.status === "ok" || value.status === "waiting")
    && (value.sourceUrl === null || typeof value.sourceUrl === "string")
    && value.metrics && Array.isArray(value.items);
  const page = location.protocol === "file:"
    ? new URL("https://gigacowork.github.io/cowork-site/kommersant-promo-dashboard.html")
    : new URL(location.href);
  page.search = "";
  page.hash = "";
  const shareTitle = "Что нового на kommersant.ru?";
  const shareLinks = [
    ["Telegram", `https://t.me/share/url?url=${encodeURIComponent(page.href)}&text=${encodeURIComponent(shareTitle)}`],
    ["VK", `https://vk.com/share.php?url=${encodeURIComponent(page.href)}`],
    ["MAX", `https://max.ru/:share?text=${encodeURIComponent(`${shareTitle} ${page.href}`)}`],
  ];

  let digest;
  try {
    digest = JSON.parse(snapshot.textContent);
  } catch {
    return;
  }

  function render(data) {
    const selected = [...data.items].sort((a, b) => {
      const changed = (item) => item.changeStatus === "new" || item.changeStatus === "updated" ? 1 : 0;
      return changed(b) - changed(a)
        || Number(b.priority === "high") - Number(a.priority === "high")
        || Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    }).slice(0, 12);
    const grouped = new Map();
    for (const item of selected) {
      const items = grouped.get(item.primaryTopic) || [];
      items.push(item);
      grouped.set(item.primaryTopic, items);
    }
    const sections = topicOrder.filter((topic) => grouped.has(topic))
      .map((title) => ({ title, items: grouped.get(title) }));
    const topicCounts = topicOrder.map((title) => ({
      title,
      count: data.items.filter((item) => item.primaryTopic === title).length,
    })).filter((topic) => topic.count > 0);
    const maxCategoryCount = Math.max(1, ...topicCounts.map((topic) => topic.count));
    const digestCheckedAt = formatDate(data.digestCheckedAt);
    const siteCheckedAt = formatDate(data.siteCheckedAt);
    const isStale = data.digestCheckedAt && data.siteCheckedAt
      && Date.parse(data.siteCheckedAt) - Date.parse(data.digestCheckedAt) > 15 * 60 * 1000;
    const metrics = [
      [data.metrics.newSinceLastRun, "Новых с прошлого запуска"],
      [data.metrics.significant24h, "Значимых за 24 часа"],
      [data.metrics.highPriority24h, "Высокий приоритет"],
    ];

    root.innerHTML = `
      <div class="artifactHeader">
        <div><h2>Бизнес-дайджест Ъ</h2><p>${digestCheckedAt
          ? `${isStale ? "Последний выпуск" : "Выпуск"} от ${escapeHtml(digestCheckedAt)} МСК`
          : "Ожидаем первый выпуск из публичной сессии"}</p></div>
        <div class="shareControl">
          <button type="button" id="share-button" class="shareButton" aria-expanded="false" aria-controls="share-options">Поделиться</button>
          <nav id="share-options" class="shareMenu" aria-label="Поделиться страницей" hidden>
            ${shareLinks.map(([name, href]) => `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${name}</a>`).join("")}
          </nav>
        </div>
      </div>
      <div class="metrics" aria-label="Показатели выпуска">${metrics.map(([value, label]) => `
        <div class="metric"><strong>${escapeHtml(value ?? "—")}</strong><span>${escapeHtml(label)}</span></div>
      `).join("")}</div>
      <div class="artifactBody">
        <div class="news"><h3 id="kommersant-news-heading">Главное в выпуске</h3>${sections.length === 0
          ? `<p class="emptyNews">${data.status === "ok"
            ? "За последние 24 часа значимых событий не найдено."
            : "В публичной сессии пока нет подходящего выпуска."}</p>`
          : `<div class="newsList" role="region" aria-labelledby="kommersant-news-heading" tabindex="0">${sections.flatMap((section) => section.items.map((item) => {
            const publishedAt = formatDate(item.publishedAt);
            const tags = [...(item.topicTags || []), ...(item.industryTags || [])].join(" · ");
            const updatedAt = formatDate(item.updatedAt);
            return `<article class="newsItem">
              <span class="newsTag">${escapeHtml(section.title)}</span>
              <h4><a href="${safeUrl(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a></h4>
              <p>${escapeHtml(item.summary)}</p>
              <p><strong>Для бизнеса:</strong> ${escapeHtml(item.businessImpact)}</p>
              <span class="newsSource">${item.priority === "high" ? "Высокий" : "Обычный"} приоритет${publishedAt ? ` · ${escapeHtml(publishedAt)} МСК` : ""}${updatedAt ? ` · обновлено ${escapeHtml(updatedAt)} МСК` : ""}${tags ? ` · ${escapeHtml(tags)}` : ""}</span>
            </article>`;
          })).join("")}</div>`}</div>
        <aside class="agenda" aria-label="Повестка по темам">
          <h3>Повестка по темам</h3><p>все значимые события за 24 часа</p>
          <div class="agendaRows">${topicCounts.map((topic) => `
            <div class="agendaRow"><div><span>${escapeHtml(topic.title)}</span><strong>${topic.count}</strong></div>
              <div class="agendaTrack"><span style="width:${topic.count / maxCategoryCount * 100}%"></span></div>
            </div>`).join("")}</div>
        </aside>
      </div>`;

    caption.innerHTML = `${data.sourceUrl
      ? `${data.status === "ok" ? "Выпуск получен из " : "Ожидается выпуск в "}<a href="${safeUrl(data.sourceUrl)}" target="_blank" rel="noopener noreferrer">публичной сессии GigaCowork</a>.`
      : "Публичная сессия для дайджеста пока не подключена."}
      ${digestCheckedAt ? ` Агент проверил материалы ${escapeHtml(digestCheckedAt)} МСК.` : ""}
      ${siteCheckedAt ? ` Сайт проверил сессию ${escapeHtml(siteCheckedAt)} МСК.` : ""}
      ${isStale ? " Новый выпуск задерживается; показан последний полученный." : ""}`;
  }

  root.addEventListener("click", (event) => {
    const button = document.getElementById("share-button");
    const menu = document.getElementById("share-options");
    if (!button || !menu) return;
    if (event.target?.id === "share-button") {
      menu.hidden = !menu.hidden;
      button.setAttribute("aria-expanded", String(!menu.hidden));
    } else if (event.target?.closest("#share-options a")) {
      menu.hidden = true;
      button.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (event.target?.closest(".shareControl")) return;
    const button = document.getElementById("share-button");
    const menu = document.getElementById("share-options");
    if (button && menu) {
      menu.hidden = true;
      button.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const button = document.getElementById("share-button");
    const menu = document.getElementById("share-options");
    if (button && menu) {
      menu.hidden = true;
      button.setAttribute("aria-expanded", "false");
    }
  });

  let secondsToNextCheck = 300;
  const updateCountdown = () => {
    const nextCheck = document.getElementById("next-check");
    if (nextCheck) nextCheck.textContent = `${String(Math.floor(secondsToNextCheck / 60)).padStart(2, "0")}:${String(secondsToNextCheck % 60).padStart(2, "0")}`;
  };
  if (location.protocol === "file:") {
    const status = document.querySelector(".liveStatus");
    if (status) status.textContent = "Обновления доступны на опубликованной странице";
  } else {
    window.setInterval(() => {
      secondsToNextCheck = Math.max(0, secondsToNextCheck - 1);
      updateCountdown();
    }, 1000);
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
    } catch {
      // The embedded snapshot remains available offline and on network errors.
    }
  }

  render(digest);
  void refresh();
  window.setInterval(() => void refresh(), 5 * 60 * 1000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void refresh();
  });
})();
