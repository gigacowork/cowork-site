import type { Metadata } from "next";
import Link from "next/link";

import { asset } from "@/lib/asset";
import { absoluteUrl } from "@/lib/site";
import { SuccessStoriesRedirect } from "./SuccessStoriesRedirect";

export const metadata: Metadata = {
  title: "Кейсы — спецпроект GigaCowork",
  robots: { index: false, follow: true },
  alternates: { canonical: absoluteUrl("/special-project/") },
};

export default function SuccessStoriesPage() {
  return (
    <section className="container-page min-h-screen py-120">
      <SuccessStoriesRedirect />
      <noscript>
        <meta httpEquiv="refresh" content={`0;url=${asset("/special-project/")}`} />
      </noscript>
      <p className="text-body-l text-text-primary">
        Кейсы переехали в спецпроект.{" "}
        <Link href="/special-project/" className="text-link">
          Открыть спецпроект
        </Link>
      </p>
    </section>
  );
}
