import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { smbUseCasePath } from "@/lib/smb-use-cases";

const legacySlugs: Record<string, string> = {
  leads: "customer-requests",
  proposals: "commercial-offers",
  analytics: "analytics",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(legacySlugs).map((slug) => ({ slug }));
}

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function OldSmbUseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const nextSlug = legacySlugs[slug];
  if (!nextSlug) notFound();

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const href = `${basePath}${smbUseCasePath(nextSlug)}/`;

  return (
    <main className="container-page min-h-screen py-120 text-body-l">
      <meta httpEquiv="refresh" content={`0;url=${href}`} />
      <p>
        Страница переехала. <a href={href}>Открыть новый адрес</a>.
      </p>
    </main>
  );
}
