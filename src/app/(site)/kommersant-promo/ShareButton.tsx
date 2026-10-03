"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./promo.module.css";

const shareTitle = "Что нового на kommersant.ru?";

function pageShareLinks() {
  const page = new URL(window.location.href);
  page.search = "";
  page.hash = "";
  const url = encodeURIComponent(page.toString());
  return [
    { name: "Telegram", href: `https://t.me/share/url?url=${url}&text=${encodeURIComponent(shareTitle)}` },
    { name: "VK", href: `https://vk.com/share.php?url=${url}` },
    { name: "MAX", href: `https://max.ru/:share?text=${encodeURIComponent(`${shareTitle} ${page.toString()}`)}` },
  ];
}

export function ShareButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState<ReturnType<typeof pageShareLinks>>([]);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={root} className={styles.shareControl}>
      <button
        type="button"
        className={className}
        aria-expanded={open}
        aria-controls="kommersant-share-options"
        onClick={() => {
          if (!open) setLinks(pageShareLinks());
          setOpen(!open);
        }}
      >
        Поделиться
      </button>
      {open ? (
        <nav id="kommersant-share-options" className={styles.shareMenu} aria-label="Поделиться страницей">
          {links.map((link) => (
            <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              {link.name}
            </a>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
