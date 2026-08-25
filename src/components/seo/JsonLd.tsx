/**
 * Микроразметка Schema.org — <script type="application/ld+json"> в разметке
 * страницы. Граф берётся из src/content/seo.ts.
 *
 * `dangerouslySetInnerHTML` здесь не риск, а единственный способ: React
 * экранирует содержимое <script>, и JSON приезжал бы в HTML с &quot; вместо
 * кавычек — поисковики такой блок не разбирают. Данные свои, из файла в
 * репозитории, пользовательского ввода в них нет.
 *
 * `</` внутри строк всё же экранируем: строка вида "</script>" в описании
 * закрыла бы тег раньше времени и сломала страницу.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default JsonLd;
