/*
  Поведение шапки сайта на страницах документации: выпадающее меню на десктопе
  и шторка на мобильном. Повторяет src/components/sections/Header.tsx, только
  без React — на страницах Antora его нет.

  Наведение обрабатывает CSS, здесь только клавиатура, клик и мобильная шторка.
*/
(function () {
  "use strict";

  var header = document.querySelector(".sc-header");
  if (!header) return;

  /* ── Выпадающее меню (десктоп) ─────────────────────────────────────────── */

  var menuButtons = Array.prototype.slice.call(
    header.querySelectorAll(".sc-nav-btn")
  );

  function closeMenus(except) {
    menuButtons.forEach(function (btn) {
      if (btn !== except) btn.setAttribute("aria-expanded", "false");
    });
  }

  menuButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = btn.getAttribute("aria-expanded") === "true";
      closeMenus(btn);
      btn.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });

  document.addEventListener("click", function (e) {
    if (!header.contains(e.target)) closeMenus();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeMenus();
      closeDrawer();
    }
  });

  /* ── Мобильная шторка ──────────────────────────────────────────────────── */

  var burger = header.querySelector(".sc-burger");
  var drawer = header.querySelector(".sc-drawer");

  function closeDrawer() {
    if (!burger || !drawer) return;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
    drawer.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (burger && drawer) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      if (open) {
        closeDrawer();
        return;
      }
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Закрыть меню");
      drawer.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  }

  /* Раскрывашки внутри шторки. */
  Array.prototype.slice
    .call(header.querySelectorAll(".sc-drawer-btn"))
    .forEach(function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        var sub = btn.nextElementSibling;
        if (sub) sub.classList.toggle("is-open", !open);
      });
    });

  /*
    Шторка живёт только на узких экранах: если окно растянули, её надо закрыть,
    иначе после возврата на мобильную ширину прокрутка страницы останется
    заблокированной.
  */
  var wide = window.matchMedia("(min-width: 768px)");
  var onWide = function (e) {
    if (e.matches) closeDrawer();
  };
  if (wide.addEventListener) wide.addEventListener("change", onWide);
  else if (wide.addListener) wide.addListener(onWide);
})();
