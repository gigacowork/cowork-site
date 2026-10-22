/** Keeps a company's legal form on the same line as the start of its name. */
export function keepLegalFormWithName(value: string): string {
  return value.replace(
    /(^|[^\p{L}])(ООО|ПАО|ОАО|ЗАО|НАО|АНО|ФГУП|ГУП|МУП|АО|ИП|ГК)[\t \u00a0]+(?=[«„“"A-Za-zА-ЯЁа-яё])/gu,
    "$1$2\u00a0",
  );
}
