import { asset } from "@/lib/asset";

/** Фирменный знак кнопки авторизации СберБизнес ID из макета CTA ММБ. */
export function SberBusinessIdLogo({ size = "default" }: { size?: "default" | "small" }) {
  if (size === "small") {
    return (
      <span className="relative block h-[16.15px] w-[101.15px]" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/img/cta/sber-business-mark-small.svg")} alt="" className="absolute left-0 top-0" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/img/cta/sber-business-id-wordmark-small.svg")} alt="" className="absolute left-[21.22px] top-[4.55px]" />
      </span>
    );
  }

  return (
    <span className="relative block h-[19px] w-[119px]" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/img/cta/sber-business-mark.svg")}
        alt=""
        className="absolute left-0 top-0"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/img/cta/sber-business-id-wordmark.svg")}
        alt=""
        className="absolute left-[25px] top-[5px]"
      />
    </span>
  );
}
