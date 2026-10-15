import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function OldFinancialAnalysisPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const href = `${basePath}/ai-for-smb/financial_analysis/`;

  return (
    <main className="container-page min-h-screen py-120 text-body-l">
      <meta httpEquiv="refresh" content={`0;url=${href}`} />
      <p>
        Страница переехала. <a href={href}>Открыть новый адрес</a>.
      </p>
    </main>
  );
}
