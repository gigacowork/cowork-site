import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SmbLessonPage from "@/components/academy/SmbLessonPage";
import { SMB_COURSE_SHORT_TITLE, SMB_LESSONS, smbLessonPath } from "@/content/ai-for-smb";
import { pageMetadata } from "@/lib/site";

type PageProps = { params: Promise<{ lessonId: string }> };

export const dynamicParams = false;

function lessonIndexFromId(lessonId: string) {
  return SMB_LESSONS.findIndex((_, index) => lessonId === `lesson-${index + 1}`);
}

export function generateStaticParams() {
  return SMB_LESSONS.map((_, index) => ({ lessonId: `lesson-${index + 1}` }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const index = lessonIndexFromId(lessonId);
  if (index < 0) return {};

  const lesson = SMB_LESSONS[index];
  return pageMetadata({
    title: `${lesson.title} — ${SMB_COURSE_SHORT_TITLE} — GigaCowork`,
    description: lesson.summary,
    path: `${smbLessonPath(lesson.slug)}/`,
  });
}

export default async function SmbLessonRoute({ params }: PageProps) {
  const { lessonId } = await params;
  const index = lessonIndexFromId(lessonId);
  if (index < 0) notFound();

  return <SmbLessonPage lesson={SMB_LESSONS[index]} index={index} />;
}
