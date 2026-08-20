/**
 * Infrastructure — «Безопасная российская ИИ-инфраструктура»
 * Figma desktop: 1927:15624 (1440 artboard, px-120 / py-80, content 1200 = 588 + 24 + 588, h-504)
 * Figma mobile:  1927:17426 (390 artboard, px-16 / py-64, gap-32, одна колонка, gap-16)
 *
 * Все тексты взяты дословно из get_design_context обоих фреймов.
 *
 * Расхождения макетов (обработаны через md:-варианты):
 *  - правые карточки на десктопе залиты градиентом «Gradient/Omni/turquoise»,
 *    на мобилке — плотными цветами bg-card-lavender #f2f3fa и bg-card-mint #f2fafa;
 *  - у карточки «Технологии Сбера» отличается угол градиента (213.7° → 222.46°);
 *  - переносы строк в описаниях есть только в десктопном фрейме (<br className="hidden md:inline" />);
 *  - цвет текста описаний: mobile #171f2d (text-primary) → desktop #3a4048 (text-secondary).
 *
 * Фиксированные размеры Figma (588 / 504 / 240) заданы через flex-1 + min-h,
 * чтобы точно совпасть на 1440 и не переполняться на планшетных ширинах 768–1199.
 * Правый паддинг карточек (96 / 160) включается с lg — ниже он оставил бы < 200px текста.
 *
 * Hooks для анимации: [data-infrastructure], [data-infra-card] (+ data-card="sber|compliance|on-premise").
 */

import Image from "@/components/ui/Image";

/* ------------------------------------------------------------------ */
/*  Заливки из Figma                                                    */
/*  Переменные Gradient/Omni/Sber и Gradient/Omni/turquoise приходят из */
/*  get_variable_defs пустыми — стопы сняты из CSS get_design_context.  */
/* ------------------------------------------------------------------ */

/** Gradient/Omni/Sber — 1927:17429 (mobile 222.46°) / 1927:15627 (desktop 213.702°) */
const GRADIENT_SBER =
  "bg-[linear-gradient(222.46deg,rgb(236,247,238)_10.474%,rgb(233,253,215)_94.872%)] " +
  "md:bg-[linear-gradient(213.702deg,rgb(236,247,238)_10.474%,rgb(233,253,215)_94.872%)]";

/** Gradient/Omni/turquoise — 1927:15629 / 1927:15630 (только десктоп) */
const GRADIENT_TURQUOISE =
  "md:bg-[linear-gradient(232.657deg,rgb(240,248,255)_20.714%,rgb(247,247,248)_94.867%)]";

const CARD_BASE =
  "relative flex flex-col overflow-hidden rounded-[24px]";

export function Infrastructure() {
  return (
    <section
      id="infrastructure"
      data-infrastructure
      className="w-full bg-bg-page py-64 md:py-80"
      aria-labelledby="infrastructure-title"
    >
      <div className="container-page flex flex-col items-center">
        {/* Заголовок — 1927:17427 (mobile, H3 25) / 1927:15625 (desktop, H2 36) */}
        <h2
          id="infrastructure-title"
          className="mb-[62px] w-full text-left text-h3 font-medium text-text-primary md:mb-[43px] md:text-center md:text-h2"
        >
          Безопасная российская
          <br />
          ИИ-инфраструктура
        </h2>

        {/* Safety / Content — 1927:17428 / 1927:15626 */}
        <div className="flex w-full flex-col gap-16 md:min-h-[504px] md:flex-row md:items-stretch md:justify-center md:gap-24">
          {/* Card / Safety · Технологии Сбера — 1927:17429 / 1927:15627 */}
          <div
            data-infra-card
            data-card="sber"
            className={`${CARD_BASE} ${GRADIENT_SBER} h-[421px] gap-40 p-40 md:h-auto md:min-w-0 md:flex-1`}
          >
            {/* I1927:15627;932:4147 — H4, neutral-1000 */}
            <p className="text-h4 font-medium text-neutral-1000">Технологии Сбера</p>

            {/* I1927:15627;515:1150 — Body/L, text-primary */}
            <p className="text-body-l text-text-primary">
              Экспертиза и инфраструктура бигтеха{" "}
              <br className="hidden md:inline" />
              для внедрения ИИ в компании любого масштаба
            </p>

            {/* Logo / Bottom — I1927:15627;938:2906 (134×37, bottom-40 left-40) */}
            <Image
              src="/img/infra/sber.svg"
              alt="Сбер"
              width={135}
              height={38}
              className="mt-auto h-[37px] w-[134px]"
            />
          </div>

          {/* Safety / Right Column — 1927:17430 / 1927:15628 */}
          <div className="flex flex-col gap-16 md:min-w-0 md:flex-1 md:justify-between md:gap-24">
            {/* Card / Safety · Соответствие требованиям РФ — 1927:17431 / 1927:15629 */}
            <div
              data-infra-card
              data-card="compliance"
              className={`${CARD_BASE} ${GRADIENT_TURQUOISE} bg-[#f2f3fa] gap-40 px-40 pb-32 pt-48 md:min-h-[240px] md:w-full md:flex-1 md:pr-40 lg:pr-96`}
            >
              <div className="flex flex-col gap-[28px]">
                {/* I1927:15629;513:1306 — H4 */}
                <p className="text-h4 font-medium text-black md:max-w-[317px] md:text-text-primary">
                  Соответствие требованиям РФ{" "}
                  <br className="hidden md:inline" />
                  по безопасности данных
                </p>
                {/* I1927:15629;513:1305 — Body/L */}
                <p className="text-body-l text-text-primary md:max-w-[422px] md:text-text-secondary">
                  Защита данных на всех уровнях: шифрование каналов связи по TLS, ролевая
                  модель доступа c SSO и Active Directory, защита от DDoS-атак
                </p>
              </div>
            </div>

            {/* Card / Safety · Локальное развертывание — 1927:17432 / 1927:15630 */}
            <div
              data-infra-card
              data-card="on-premise"
              className={`${CARD_BASE} ${GRADIENT_TURQUOISE} bg-[#f2fafa] gap-40 px-40 py-40 md:min-h-[240px] md:w-full md:flex-1 md:pr-40 lg:pr-[160px]`}
            >
              <div className="flex flex-col gap-24">
                {/* I1927:15630;513:1306 — H4 */}
                <p className="text-h4 font-medium text-black md:max-w-[317px] md:text-text-primary">
                  Локальное развертывание —
                  <br />
                  On-premise
                </p>
                {/* I1927:15630;513:1305 — Body/L */}
                <p className="text-body-l text-text-primary md:max-w-[422px] md:text-text-secondary">
                  Возможность внедрения платформы в контур компании – все данные остаются
                  внутри корпоративной инфраструктуры
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Infrastructure;
