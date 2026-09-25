"use client";

import { useEffect, useRef, useState } from "react";

import { asset } from "@/lib/asset";
import Button from "@/components/ui/Button";
import VideoGuides from "@/components/interactive/VideoGuides";
import { GUIDES, guidePoster } from "@/content/guides";

/**
 * Блок «Начните работать с GigaCowork» на странице «Академия»
 * (5196:54292 / мобильный 5340:37561).
 *
 * Те же ролики, что на /guides, но показаны иначе: там лента — ролик за
 * роликом, здесь кнопки тем переключают один урок на месте. Сам список
 * роликов общий, из `src/content/guides.ts`.
 *
 * Ролик один на все темы: при переключении меняется `src` у того же
 * `<video>`, а не пересобирается разметка. Так у карточки остаётся тот же
 * узел DOM — а значит, продолжают работать кнопки звука и полного экрана,
 * модалка и автозапуск, которые навешивает `VideoGuides` (они живут на
 * элементе, а не на React-дереве).
 *
 * `VideoGuides` здесь используется только ради этой обвязки: хуков
 * `data-guide-tab` / `data-guide-item` в разметке нет, подсветку темы ведёт
 * React, и скролл-шпион обёртки просто не находит, за чем следить.
 */

/** Ширины колонок из макета: копия 390, карточка 792, зазор 18. */
const LESSON_GRID = "lg:grid lg:grid-cols-[390fr_792fr] lg:gap-[18px]";

export function AcademyLessons() {
  const [active, setActive] = useState(GUIDES[0].id);
  const videoRef = useRef<HTMLVideoElement>(null);

  const lesson = GUIDES.find((item) => item.id === active) ?? GUIDES[0];

  /*
    Смена `src` у видео — это новая загрузка, и элемент после неё стоит на
    паузе. Автозапуск обёртки завязан на появление карточки в кадре и второй
    раз не сработает: карточка с места не двигалась. Поэтому запускаем ролик
    сами — и молчим, если браузер отказал (это нормально, например при
    экономии трафика).
  */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => {});
  }, [active]);

  return (
    <VideoGuides>
      <div className="container-page flex flex-col gap-32 md:gap-64">
        {/* Кнопки тем — Button Large: активная Primary, остальные Secondary */}
        <nav aria-label="Темы обучающих роликов">
          <ul className="flex flex-wrap gap-12">
            {GUIDES.map((guide) => (
              <li key={guide.id}>
                <Button
                  variant={guide.id === active ? "primary" : "secondary"}
                  size="lg"
                  aria-pressed={guide.id === active}
                  onClick={() => setActive(guide.id)}
                >
                  {guide.tab}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`flex flex-col gap-32 ${LESSON_GRID}`}>
          {/* Текст урока */}
          <div className="flex flex-col gap-16 md:gap-32">
            <h3 className="text-h3 font-medium text-text-primary">
              {lesson.title}
            </h3>
            <div className="flex flex-col gap-16">
              {lesson.paragraphs.map((text) => (
                <p key={text} className="text-body-l text-text-primary">
                  {text}
                </p>
              ))}
            </div>
          </div>

          {/*
            Ролик лежит в такой же рамке, как на /guides: скругление 24,
            тонкая обводка и тень. В макете (5267:59044) вокруг него была ещё
            одна подложка с градиентом и полями — от неё отказались, кадр
            интерфейса сам по себе светлый, и вторая рамка вокруг первой
            выглядела лишней.
          */}
          <div
            data-guide-video
            className="relative aspect-video w-full overflow-hidden rounded-24 border border-border-subtle bg-neutral-50 shadow-drop-sm transition-shadow duration-300 hover:shadow-drop-lg"
          >
            <video
              ref={videoRef}
              src={asset(lesson.video)}
              poster={asset(guidePoster(lesson.id))}
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={lesson.title}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </div>
      </div>
    </VideoGuides>
  );
}

export default AcademyLessons;
