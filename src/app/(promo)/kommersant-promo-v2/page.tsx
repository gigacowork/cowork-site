import type { Metadata } from "next";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Промостраница Коммерсанта — GigaCowork",
  robots: { index: false, follow: false },
};

export default function KommersantPromoRedirectPage() {
  const href = asset("/kommersant-promo/");
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${href}`} />
      <p>Промостраница переехала на <a href={href}>новый адрес</a>.</p>
    </>
  );
}
