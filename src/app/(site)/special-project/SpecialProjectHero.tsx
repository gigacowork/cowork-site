"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/Button";
import { asset } from "@/lib/asset";
import { keepRussianShortWords } from "@/lib/typography";
import styles from "./special-project.module.css";

// Control points match the land visible in the orbital illustration.
// The artwork is not a linear map, so central cities need their own anchors.
const mapProjection = [
  { lon: 20.4522, x: 242, y55: 253, latScale: 3 },
  { lon: 37.6176, x: 440, y55: 339, latScale: 5.6 },
  { lon: 49.121, x: 573, y55: 409, latScale: 7.35 },
  { lon: 60.6122, x: 669, y55: 440, latScale: 9.1 },
  { lon: 82.9204, x: 839, y55: 423, latScale: 12.5 },
  { lon: 92.8725, x: 944, y55: 448, latScale: 14 },
  { lon: 104.2807, x: 980, y55: 500, latScale: 15.8 },
  { lon: 129.7326, x: 1340, y55: 490, latScale: 12 },
  { lon: 135.0719, x: 1385, y55: 490, latScale: 12 },
];

function project(lon: number, lat: number) {
  const nextIndex = mapProjection.findIndex((stop) => stop.lon >= lon);
  const toIndex = nextIndex < 1 ? 1 : nextIndex;
  const from = mapProjection[toIndex - 1];
  const to = mapProjection[toIndex] ?? mapProjection[mapProjection.length - 1];
  const portion = Math.max(0, Math.min(1, (lon - from.lon) / (to.lon - from.lon)));
  const x = from.x + (to.x - from.x) * portion;
  const y55 = from.y55 + (to.y55 - from.y55) * portion;
  const latScale = from.latScale + (to.latScale - from.latScale) * portion;
  return { x, y: y55 + (55 - lat) * latScale };
}

function city(name: string, lon: number, lat: number, at: number, label = false) {
  return { name, lon, lat, at, label, ...project(lon, lat) };
}

const cities = {
  kaliningrad: city("Калининград", 20.4522, 54.7104, 0, true),
  petersburg: { ...city("Санкт-Петербург", 30.3158, 59.9391, 0.10), x: 389, y: 248 },
  moscow: { ...city("Москва", 37.6176, 55.7558, 0.13), x: 410, y: 390 },
  murmansk: city("Мурманск", 33.0827, 68.9707, 0.18),
  arkhangelsk: city("Архангельск", 40.5433, 64.5393, 0.20),
  nizhny: city("Нижний Новгород", 44.0020, 56.3269, 0.21),
  kazan: city("Казань", 49.121, 55.7887, 0.26),
  samara: city("Самара", 50.1008, 53.1959, 0.31),
  ufa: city("Уфа", 56.0389, 54.7388, 0.36),
  ekaterinburg: city("Екатеринбург", 60.6122, 56.8389, 0.40),
  tyumen: city("Тюмень", 65.5343, 57.1522, 0.46),
  omsk: city("Омск", 73.3682, 54.9893, 0.51),
  novosibirsk: city("Новосибирск", 82.9204, 55.0302, 0.57),
  tomsk: city("Томск", 84.9522, 56.4884, 0.61),
  krasnoyarsk: city("Красноярск", 92.8725, 56.0106, 0.64),
  // The far-north shore is heavily stylized; place the marker on its visible land.
  norilsk: { ...city("Норильск", 88.2014, 69.3535, 0.67), x: 950, y: 330 },
  irkutsk: city("Иркутск", 104.2807, 52.2869, 0.71),
  ulanUde: city("Улан-Удэ", 107.5846, 51.8335, 0.75),
  chita: city("Чита", 113.497, 52.0340, 0.78),
  // Place Khabarovsk inland, northwest of the painted coastal peninsula.
  khabarovsk: { ...city("Хабаровск", 135.0719, 48.4802, 0.91), x: 1345, y: 505 },
  // Keep the destination point and its label on the peninsula.
  vladivostok: { ...city("Владивосток", 131.8855, 43.1155, 0.94, true), x: 1450, y: 690 },
} as const;

type CityKey = keyof typeof cities;
type Route = { from: CityKey; to: CityKey; at: number; bend?: number };
type Branch = { from: CityKey; dx: number; dy: number; at: number };

const routes: Route[] = [
  { from: "kaliningrad", to: "petersburg", at: 0.04, bend: -1 },
  { from: "kaliningrad", to: "moscow", at: 0.06, bend: 1 },
  { from: "petersburg", to: "murmansk", at: 0.12, bend: -1 },
  { from: "petersburg", to: "arkhangelsk", at: 0.14, bend: 1 },
  { from: "petersburg", to: "moscow", at: 0.15, bend: -1 },
  { from: "petersburg", to: "kazan", at: 0.19, bend: -1 },
  { from: "moscow", to: "nizhny", at: 0.17 },
  { from: "moscow", to: "kazan", at: 0.19, bend: -1 },
  { from: "moscow", to: "samara", at: 0.24, bend: 1 },
  { from: "moscow", to: "ufa", at: 0.28, bend: -1 },
  { from: "nizhny", to: "samara", at: 0.23 },
  { from: "kazan", to: "ufa", at: 0.28 },
  { from: "kazan", to: "ekaterinburg", at: 0.34, bend: -1 },
  { from: "samara", to: "ekaterinburg", at: 0.33, bend: -1 },
  { from: "ufa", to: "ekaterinburg", at: 0.35 },
  { from: "ekaterinburg", to: "tyumen", at: 0.41 },
  { from: "tyumen", to: "omsk", at: 0.46, bend: -1 },
  { from: "omsk", to: "novosibirsk", at: 0.51 },
  { from: "tyumen", to: "tomsk", at: 0.53, bend: -1 },
  { from: "novosibirsk", to: "tomsk", at: 0.57, bend: -1 },
  { from: "novosibirsk", to: "krasnoyarsk", at: 0.59 },
  { from: "krasnoyarsk", to: "norilsk", at: 0.64, bend: -1 },
  { from: "krasnoyarsk", to: "irkutsk", at: 0.65 },
  { from: "novosibirsk", to: "irkutsk", at: 0.66, bend: 1 },
  { from: "irkutsk", to: "ulanUde", at: 0.71 },
  { from: "irkutsk", to: "chita", at: 0.73, bend: -1 },
  { from: "chita", to: "khabarovsk", at: 0.83 },
  { from: "ulanUde", to: "khabarovsk", at: 0.84, bend: -1 },
  { from: "khabarovsk", to: "vladivostok", at: 0.89, bend: -1 },
];

// Small unnamed endpoints turn the main routes into a network across the map.
const branches: Branch[] = [
  { from: "petersburg", dx: -38, dy: 32, at: 0.15 },
  { from: "petersburg", dx: 32, dy: -36, at: 0.17 },
  { from: "petersburg", dx: 66, dy: 14, at: 0.19 },
  { from: "moscow", dx: -56, dy: -34, at: 0.16 },
  { from: "moscow", dx: -73, dy: 8, at: 0.17 },
  { from: "moscow", dx: -27, dy: -61, at: 0.18 },
  { from: "moscow", dx: 18, dy: -64, at: 0.19 },
  { from: "moscow", dx: 55, dy: -42, at: 0.20 },
  { from: "moscow", dx: 81, dy: 3, at: 0.21 },
  { from: "moscow", dx: 53, dy: 45, at: 0.22 },
  { from: "moscow", dx: 16, dy: 69, at: 0.23 },
  { from: "moscow", dx: -35, dy: 48, at: 0.24 },
  { from: "moscow", dx: -72, dy: 34, at: 0.25 },
  { from: "kazan", dx: -28, dy: -39, at: 0.29 },
  { from: "kazan", dx: 32, dy: -46, at: 0.30 },
  { from: "kazan", dx: 59, dy: 19, at: 0.32 },
  { from: "kazan", dx: 14, dy: 51, at: 0.33 },
  { from: "ekaterinburg", dx: -39, dy: -39, at: 0.43 },
  { from: "ekaterinburg", dx: 8, dy: -65, at: 0.44 },
  { from: "ekaterinburg", dx: 51, dy: -25, at: 0.45 },
  { from: "ekaterinburg", dx: 63, dy: 31, at: 0.47 },
  { from: "ekaterinburg", dx: -18, dy: 57, at: 0.48 },
  { from: "novosibirsk", dx: -39, dy: -43, at: 0.59 },
  { from: "novosibirsk", dx: 20, dy: -52, at: 0.60 },
  { from: "novosibirsk", dx: 64, dy: -13, at: 0.61 },
  { from: "novosibirsk", dx: 37, dy: 46, at: 0.62 },
  { from: "krasnoyarsk", dx: -42, dy: -39, at: 0.67 },
  { from: "krasnoyarsk", dx: 12, dy: -61, at: 0.68 },
  { from: "krasnoyarsk", dx: 68, dy: 14, at: 0.69 },
  { from: "krasnoyarsk", dx: 33, dy: 53, at: 0.70 },
  { from: "irkutsk", dx: -43, dy: -39, at: 0.74 },
  { from: "irkutsk", dx: 34, dy: -40, at: 0.76 },
  { from: "irkutsk", dx: 74, dy: 12, at: 0.77 },
  { from: "irkutsk", dx: 20, dy: 48, at: 0.78 },
  { from: "chita", dx: -22, dy: -34, at: 0.81 },
  { from: "chita", dx: 35, dy: -47, at: 0.83 },
  { from: "chita", dx: 52, dy: 30, at: 0.85 },
  { from: "khabarovsk", dx: -49, dy: -39, at: 0.92 },
  { from: "khabarovsk", dx: -61, dy: 19, at: 0.93 },
  { from: "khabarovsk", dx: -25, dy: 45, at: 0.94 },
];

function arc({ from, to, bend = 1 }: Route) {
  const start = cities[from];
  const end = cities[to];
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const lift = Math.min(54, distance * 0.22) * bend;
  const nx = (end.y - start.y) / distance;
  const ny = -(end.x - start.x) / distance;
  return `M ${start.x} ${start.y} Q ${(start.x + end.x) / 2 + nx * lift} ${(start.y + end.y) / 2 + ny * lift} ${end.x} ${end.y}`;
}

function branchArc({ from, dx, dy }: Branch) {
  const start = cities[from];
  const endX = start.x + dx;
  const endY = start.y + dy;
  const bend = Math.min(14, Math.hypot(dx, dy) * 0.16);
  return `M ${start.x} ${start.y} Q ${start.x + dx * 0.5 - dy / 70 * bend} ${start.y + dy * 0.5 + dx / 70 * bend} ${endX} ${endY}`;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export function SpecialProjectHero() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const beams = Array.from(map.querySelectorAll<SVGPathElement>("[data-route]"));
    const cores = Array.from(map.querySelectorAll<SVGPathElement>("[data-core]"));
    const pulses = Array.from(map.querySelectorAll<SVGCircleElement>("[data-pulse]"));
    const points = Array.from(map.querySelectorAll<SVGCircleElement>("[data-point]"));
    const labels = Array.from(map.querySelectorAll<SVGTextElement>("[data-label]"));
    const branchBeams = Array.from(map.querySelectorAll<SVGPathElement>("[data-branch]"));
    const branchPoints = Array.from(map.querySelectorAll<SVGCircleElement>("[data-branch-point]"));
    const lengths = cores.map((path) => path.getTotalLength());
    let frame = 0;

    const keepKaliningradBelowHeader = () => {
      const label = map.querySelector<SVGTextElement>('[data-label="kaliningrad"]');
      const svg = label?.ownerSVGElement;
      const header = document.querySelector("header");
      if (!label || !svg || !header) return;
      label.setAttribute("dy", "0");
      const overlap = header.getBoundingClientRect().bottom + 12 - label.getBoundingClientRect().top;
      const scale = svg.getBoundingClientRect().height / 941;
      if (overlap > 0 && scale > 0) label.setAttribute("dy", String(overlap / scale));
    };

    const render = (progress: number) => {
      beams.forEach((path) => {
        const index = Number(path.dataset.route);
        const reveal = smooth(routes[index].at, routes[index].at + 0.085, progress);
        path.style.strokeDashoffset = String(1 - reveal);
      });
      cores.forEach((path, index) => {
        const reveal = smooth(routes[index].at, routes[index].at + 0.085, progress);
        const pulse = pulses[index];
        if (reveal <= 0 || reveal >= 1) {
          pulse.style.opacity = "0";
        } else {
          const position = cores[index].getPointAtLength(lengths[index] * reveal);
          pulse.setAttribute("cx", String(position.x));
          pulse.setAttribute("cy", String(position.y));
          pulse.style.opacity = String(Math.min(1, reveal * 7, (1 - reveal) * 7));
        }
      });
      branchBeams.forEach((path) => {
        const index = Number(path.dataset.branch);
        path.style.strokeDashoffset = String(1 - smooth(branches[index].at, branches[index].at + 0.055, progress));
      });
      branchPoints.forEach((point) => {
        const index = Number(point.dataset.branchPoint);
        point.style.opacity = String(smooth(branches[index].at + 0.025, branches[index].at + 0.065, progress));
      });
      points.forEach((point) => {
        const city = point.dataset.point as CityKey;
        point.style.opacity = String(smooth(cities[city].at - 0.02, cities[city].at + 0.035, progress));
      });
      labels.forEach((label) => {
        const city = label.dataset.label as CityKey;
        label.style.opacity = city === "kaliningrad" ? "1" : String(smooth(cities[city].at, cities[city].at + 0.045, progress));
      });
    };

    keepKaliningradBelowHeader();
    window.addEventListener("resize", keepKaliningradBelowHeader);

    if (motion.matches || window.matchMedia("(max-width: 767px)").matches) {
      render(1);
      return () => window.removeEventListener("resize", keepKaliningradBelowHeader);
    }

    const duration = 4800;
    let startedAt: number | null = null;
    let imageReady = false;
    let inView = false;
    let started = false;
    const image = map.querySelector<HTMLImageElement>("img");
    const hero = map.closest("section");

    const animate = (now: number) => {
      if (startedAt === null) startedAt = now;
      const elapsed = clamp((now - startedAt) / duration);
      render(elapsed);
      if (elapsed < 1) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    render(0);
    const startWhenReady = () => {
      if (started || !imageReady || !inView || document.visibilityState !== "visible") return;
      started = true;
      frame = window.requestAnimationFrame(animate);
    };

    const onImageReady = () => {
      imageReady = true;
      startWhenReady();
    };
    if (image?.complete && image.naturalWidth > 0) {
      onImageReady();
    } else {
      image?.addEventListener("load", onImageReady, { once: true });
    }

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      startWhenReady();
    }, { threshold: 0.1 });
    if (hero) observer.observe(hero);
    document.addEventListener("visibilitychange", startWhenReady);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      image?.removeEventListener("load", onImageReady);
      observer.disconnect();
      document.removeEventListener("visibilitychange", startWhenReady);
      window.removeEventListener("resize", keepKaliningradBelowHeader);
    };
  }, []);

  return (
    <section className={styles.journey} aria-labelledby="special-project-title">
      <div className={styles.stage}>
        <div ref={mapRef} className={styles.mapCanvas} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.mapImage} src={asset("/img/special-project/hero-orbit-journey-v5.webp")} alt="" fetchPriority="high" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.uralsRelief} src={asset("/img/special-project/urals-relief-v1.webp")} alt="" />
          <svg className={styles.routes} viewBox="0 0 1672 941" preserveAspectRatio="none">
            <defs>
              <linearGradient id="journey-beam" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="48%" stopColor="#9df6ff" />
                <stop offset="100%" stopColor="#f6c7ff" />
              </linearGradient>
            </defs>
            {branches.map((branch, index) => (
              <g key={`${branch.from}-${branch.dx}-${branch.dy}`}>
                <path data-branch={index} className={styles.branchBeam} d={branchArc(branch)} pathLength={1} />
                <circle data-branch-point={index} className={styles.branchPoint} cx={cities[branch.from].x + branch.dx} cy={cities[branch.from].y + branch.dy} r="2" />
              </g>
            ))}
            {routes.map((route, index) => (
              <g key={`${route.from}-${route.to}`}>
                <path data-route={index} className={styles.beamGlow} d={arc(route)} pathLength={1} />
                <path data-route={index} data-core className={styles.beamCore} d={arc(route)} pathLength={1} />
                <circle data-pulse={index} className={styles.pulsePoint} r="4" />
              </g>
            ))}
            {(Object.entries(cities) as [CityKey, typeof cities[CityKey]][]).filter(([city]) => city !== "kaliningrad").map(([city, point]) => (
              <circle key={city} data-point={city} className={styles.cityPoint} cx={point.x} cy={point.y} r="3.4" />
            ))}
            {(Object.entries(cities) as [CityKey, typeof cities[CityKey]][]).filter(([, point]) => point.label).map(([city, point]) => (
              <text key={city} data-label={city} className={styles.cityLabel} x={point.x + (city === "vladivostok" ? -9 : 9)} y={point.y + (city === "kaliningrad" ? 25 : -12)} textAnchor={city === "vladivostok" ? "end" : "start"}>{point.name}</text>
            ))}
            <circle className={styles.originPoint} cx={cities.kaliningrad.x} cy={cities.kaliningrad.y} r="5" />
          </svg>
        </div>

        <div className={`container-page ${styles.copyWrap}`}>
          <div className={styles.copy}>
            <h1 id="special-project-title" className={styles.title}>{keepRussianShortWords("От Калининграда до Владивостока")}</h1>
            <p className={styles.subtitle}>{keepRussianShortWords("как ИИ-агенты GigaCowork меняют российский бизнес")}</p>
            <div className={styles.actions}>
              <Button href="/lead/" variant="primary" size="lg">{keepRussianShortWords("Попробовать GigaCowork")}</Button>
            </div>
          </div>
        </div>

        <div className={`container-page ${styles.disclaimerWrap}`}>
          <small className={styles.disclaimer}>{keepRussianShortWords("Представленное изображение является художественной 3D-иллюстрацией и не является точной географической картой")}</small>
        </div>
      </div>
    </section>
  );
}
