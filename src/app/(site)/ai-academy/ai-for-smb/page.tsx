import type { Metadata } from "next";
import Link from "next/link";

import { SMB_COURSE_PATH } from "@/content/ai-for-smb";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Курс для малого бизнеса — GigaCowork",
  robots: { index: false, follow: true },
};

export default function SmbCourseOldAddressPage() {
  return (
    <main className="container-page py-120">
      <meta httpEquiv="refresh" content={`0;url=${asset(`${SMB_COURSE_PATH}/`)}`} />
      <p className="text-body-l text-text-primary">
        Страница курса переехала. <Link href={SMB_COURSE_PATH} className="underline underline-offset-4">Открыть курс для малого бизнеса</Link>
      </p>
    </main>
  );
}
