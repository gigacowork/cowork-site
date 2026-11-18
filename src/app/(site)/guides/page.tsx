import type { Metadata } from "next";
import Link from "next/link";

import { asset } from "@/lib/asset";
import { absoluteUrl } from "@/lib/site";
import { GuidesRedirect } from "./GuidesRedirect";

export const metadata: Metadata = {
  title: "Академия GigaCowork",
  robots: { index: false, follow: true },
  alternates: { canonical: absoluteUrl("/ai-academy/") },
};

export default function GuidesPage() {
  return (
    <section className="container-page min-h-screen py-120">
      <GuidesRedirect />
      <noscript>
        <meta httpEquiv="refresh" content={`0;url=${asset("/ai-academy/")}`} />
      </noscript>
      <p className="text-body-l text-text-primary">
        Гайды доступны в Академии.{" "}
        <Link href="/ai-academy/" className="text-link">
          Открыть Академию
        </Link>
      </p>
    </section>
  );
}
