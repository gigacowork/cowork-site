"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./landing-events.module.css";

/**
 * Проигрыватель киоска: ролик сам стартует, крутится по кругу и без звука.
 * Перенесено из `VideoPlayer.tsx`.
 *
 * Первый кадр снимается в canvas и запоминается на весь сеанс: без постера
 * при возврате на экран ролик успевал моргнуть чёрным. Кадр берётся с
 * чужого домена, поэтому у видео `crossOrigin="anonymous"` — иначе canvas
 * «пачкается» и `toDataURL` бросает исключение (оно тут и перехвачено).
 */

/** Кэш постеров на сеанс: ключ — адрес ролика. */
const posterCache = new Map<string, string>();

function captureFirstFrame(video: HTMLVideoElement): string | null {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7);
  } catch {
    return null;
  }
}

export function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [poster, setPoster] = useState<string | undefined>(undefined);

  useEffect(() => {
    setPoster(posterCache.get(src));
    if (posterCache.has(src)) return;

    const video = videoRef.current;
    if (!video) return;

    const onLoadedData = () => {
      const captured = captureFirstFrame(video);
      if (captured) {
        posterCache.set(src, captured);
        setPoster(captured);
      }
    };

    video.addEventListener("loadeddata", onLoadedData, { once: true });
    return () => video.removeEventListener("loadeddata", onLoadedData);
  }, [src]);

  return (
    <video
      key={src}
      ref={videoRef}
      className={styles.video}
      src={src}
      poster={poster}
      preload="auto"
      crossOrigin="anonymous"
      autoPlay
      loop
      muted
      playsInline
      controls
      disablePictureInPicture
      controlsList="nodownload noplaybackrate nofullscreen"
    />
  );
}

export default VideoPlayer;
