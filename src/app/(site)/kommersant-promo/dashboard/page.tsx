import type { Metadata } from "next";

import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Дашборд Коммерсанта переехал",
  robots: { index: false, follow: false },
};

export default function KommersantDashboardRedirectPage() {
  const href = asset("/kommersant-promo-dashboard/");
  return (
    <main className="container-page" style={{ paddingBlock: "calc(var(--header-h) + 48px) 80px" }}>
      <meta httpEquiv="refresh" content={`0;url=${href}`} />
      <p>Дашборд переехал на <a href={href}>новый адрес</a>.</p>
    </main>
  );
}
