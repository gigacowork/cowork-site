import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SMB_LESSONS, smbLessonPath } from "@/content/ai-for-smb";
import { asset } from "@/lib/asset";

type PageProps = { params: Promise<{ lessonId: string }> };

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Урок переехал — GigaCowork",
  robots: { index: false, follow: true },
};

function lessonIndexFromId(lessonId: string) {
  return SMB_LESSONS.findIndex((lesson) => lessonId === `lesson-${lesson.number}`);
}

export function generateStaticParams() {
  return SMB_LESSONS.map((lesson) => ({ lessonId: `lesson-${lesson.number}` }));
}

export default async function SmbLessonOldAddressPage({ params }: PageProps) {
  const { lessonId } = await params;
  const index = lessonIndexFromId(lessonId);
  if (index < 0) notFound();

  const href = smbLessonPath(SMB_LESSONS[index].slug);

  return (
    <main className="container-page py-120">
      <meta httpEquiv="refresh" content={`0;url=${asset(`${href}/`)}`} />
      <p className="text-body-l text-text-primary">
        Урок переехал. <Link href={href} className="underline underline-offset-4">Открыть урок</Link>
      </p>
    </main>
  );
}
