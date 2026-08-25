import type { Metadata } from "next";
import ScreenFrame from "@/components/landing-events/ScreenFrame";
import VideoPlayer from "@/components/landing-events/VideoPlayer";
import { PillButton } from "@/components/landing-events/Controls";
import { HOME_VIDEO } from "@/lib/landing-events";
import styles from "@/components/landing-events/landing-events.module.css";

export const metadata: Metadata = {
  title: "GigaCowork",
};

/** Первый экран: ролик на весь кадр и одна кнопка — к выбору сценария. */
export default function LandingEventsHome() {
  return (
    <ScreenFrame
      footer={
        <div className={styles.homeFooterRow}>
          <PillButton
            href="/landing-events/categories"
            variant="dark"
            style={{ width: 340 }}
          >
            {"Попробовать\nGigaCowork"}
          </PillButton>
        </div>
      }
    >
      <div className={styles.homeVideoWrap}>
        <VideoPlayer src={HOME_VIDEO} />
      </div>
    </ScreenFrame>
  );
}
