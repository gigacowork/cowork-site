"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { agents } from "./agents";
import styles from "./page.module.css";

const figmaAsset = asset("/agents-new-year/figma");

export default function RoleNavigation({ mobile = false }: { mobile?: boolean }) {
  const marker = useRef<HTMLSpanElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("page-title")?.closest("section");
    const update = () => setStuck(
      mobile
        ? (marker.current?.getBoundingClientRect().top ?? 1) <= 0
        : (hero?.getBoundingClientRect().bottom ?? Infinity) <= 80,
    );
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [mobile]);

  const chips = (
    <div className={styles.navChips}>
      {agents.map((agent) => (
        <a href={`#${agent.id}`} className={styles.navChip} key={agent.id}>
          <img src={`${figmaAsset}/${mobile ? "mobile" : "desktop"}/imgIcon${agent.icon}.svg`} width="18" height="18" alt="" />
          {agent.short}
        </a>
      ))}
    </div>
  );

  return (
    <>
      {mobile && <span ref={marker} className={styles.mobileNavSentinel} aria-hidden="true" />}
      <nav className={mobile ? styles.mobileNav : styles.desktopNav} aria-label="Выбрать агента">
        {mobile && <span className={styles.navLabel}>Выбрать агента</span>}
        {chips}
      </nav>
      {mobile && stuck && <nav className={styles.mobileFloatingNav} aria-label="Быстрый переход к агенту">{chips}</nav>}
      {!mobile && stuck && <nav className={styles.desktopFloatingNav} aria-label="Быстрый переход к агенту">{chips}</nav>}
    </>
  );
}

