export function normalizeText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('ru-RU')
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ');
}

/**
 * Приводит обозначение класса к виду "10а", чтобы запросы
 * «10-А», «10А», «10 а» и «10-a» одинаково находили класс.
 */
export function normalizeClassName(value: string): string {
  return normalizeText(value)
    .replace(/[\s\-–—.]/g, '')
    .replace(/a/g, 'а')
    .replace(/b/g, 'б');
}

export function humanizeClassName(value: string): string {
  const match = value.match(/^(\d{1,2})\s*[-–—]?\s*([А-Яа-яA-Za-z])$/);
  if (!match) {
    return value;
  }
  return `${match[1]}-${match[2].toUpperCase()}`;
}

export function pluralizeRu(
  count: number,
  one: string,
  few: string,
  many: string,
): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) {
    return many;
  }
  if (mod10 === 1) {
    return one;
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return few;
  }
  return many;
}
