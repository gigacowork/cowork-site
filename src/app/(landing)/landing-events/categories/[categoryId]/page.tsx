import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ScreenFrame from "@/components/landing-events/ScreenFrame";
import VideoPlayer from "@/components/landing-events/VideoPlayer";
import { IconLink, PillButton } from "@/components/landing-events/Controls";
import {
  DEMO_URL,
  LANDING_CATEGORIES,
  getLandingCategory,
} from "@/lib/landing-events";
import styles from "@/components/landing-events/landing-events.module.css";

/**
 * Экран ролика выбранного сценария.
 *
 * При статическом экспорте страницы существуют только для перечисленных
 * ниже адресов; всё остальное отдаёт общий 404. В исходнике неизвестный id
 * молча возвращал на экран категорий — здесь так не сделать: сервера,
 * который мог бы переадресовать, на GitHub Pages нет.
 */

export function generateStaticParams() {
  return LANDING_CATEGORIES.map((category) => ({ categoryId: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}): Promise<Metadata> {
  const { categoryId } = await params;
  const category = getLandingCategory(categoryId);

  return { title: `${category?.title ?? "Сценарий"} — GigaCowork` };
}

export default async function LandingEventsCategory({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const category = getLandingCategory(categoryId);
  if (!category) notFound();

  return (
    <ScreenFrame
      footer={
        <div className={styles.footerRow}>
          <div className={styles.footerLeft}>
            <IconLink
              icon="/landing-events/decor/icon-home.png"
              alt="На главную"
              href="/landing-events"
            />
            <PillButton
              href="/landing-events/categories"
              variant="light"
              icon="/landing-events/decor/icon-back.png"
            >
              Назад
            </PillButton>
          </div>
          <PillButton href={DEMO_URL} external variant="dark">
            Демо
          </PillButton>
        </div>
      }
    >
      <div className={styles.categoryVideoWrap}>
        <div className={styles.categoryVideoInner}>
          <VideoPlayer src={category.video} />
        </div>
      </div>
    </ScreenFrame>
  );
}
