import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SMB_LESSONS, smbLessonPath } from "@/content/ai-for-smb";
import { asset } from "@/lib/asset";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Урок переехал — GigaCowork",
  robots: { index: false, follow: true },
};

export function generateStaticParams() {
  return SMB_LESSONS.map(({ slug }) => ({ slug }));
}

export default async function SmbLessonOldAddressPage({ params }: PageProps) {
  const { slug } = await params;
  if (!SMB_LESSONS.some((lesson) => lesson.slug === slug)) notFound();

  const href = smbLessonPath(slug);

  return (
    <main className="container-page py-120">
      <meta httpEquiv="refresh" content={`0;url=${asset(`${href}/`)}`} />
      <p className="text-body-l text-text-primary">
        Урок переехал. <Link href={href} className="underline underline-offset-4">Открыть урок</Link>
      </p>
    </main>
  );
}
