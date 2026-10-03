import { CookieNotice } from "@/components/interactive/CookieNotice";

export default function PromoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main>{children}</main>
      <CookieNotice />
    </>
  );
}
