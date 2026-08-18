import { Fragment } from "react";

/**
 * Переносы строк из макета.
 *
 * В Figma заголовки разбиты на строки вручную (жёсткий Enter внутри текстового
 * слоя), и от этого зависит ритм блока. В данных такие места помечены «\n»,
 * здесь они превращаются в <br>.
 *
 * Ниже md переносы снимаются: на 390 колонка узкая, и жёсткая разбивка,
 * рассчитанная на 480–800, рвала бы строки в неожиданных местах. Поэтому <br>
 * скрыт до md, а на его месте остаётся обычный пробел.
 */
export function Lines({ text, always = false }: { text: string; always?: boolean }) {
  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={`${line}-${i}`}>
          {i > 0 ? (
            <>
              {" "}
              <br className={always ? "" : "hidden md:inline"} />
            </>
          ) : null}
          {line}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Абзацы одним текстовым слоем: в макете это единый блок, где абзацы разделены
 * пустой строкой, а не отступом контейнера. Пустая строка даёт ровно высоту
 * строки текста — gap на flex-контейнере дал бы другой шаг.
 */
export function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, i) => (
        <Fragment key={`${item}-${i}`}>
          {i > 0 ? (
            <>
              <br />
              <br />
            </>
          ) : null}
          <Lines text={item} />
        </Fragment>
      ))}
    </>
  );
}

export default Lines;
