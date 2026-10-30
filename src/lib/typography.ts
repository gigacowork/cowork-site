/** Keeps a company's legal form on the same line as the start of its name. */
export function keepLegalFormWithName(value: string): string {
  return value.replace(
    /(^|[^\p{L}])(ООО|ПАО|ОАО|ЗАО|НАО|АНО|ФГУП|ГУП|МУП|АО|ИП|ГК)[\t \u00a0]+(?=[«„“"A-Za-zА-ЯЁа-яё])/gu,
    "$1$2\u00a0",
  );
}

/** Keeps short Russian prepositions, conjunctions and particles with the next word. */
export function keepRussianShortWords(value: string): string {
  const shortWord = /(^|[^\p{L}])(а|без|бы|в|во|да|для|до|же|за|и|из|к|как|ко|ли|на|над|не|ни|но|о|об|от|по|под|при|про|с|со|у|что)[\t ]+(?=[\p{L}\p{N}«„“"])/giu;
  let result = value;
  let next = result.replace(shortWord, "$1$2\u00a0");
  while (next !== result) {
    result = next;
    next = result.replace(shortWord, "$1$2\u00a0");
  }
  return result;
}
