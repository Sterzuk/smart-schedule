import { WEEKDAYS, Weekday } from './schedule.constants';

const DAY_STEMS: Array<{ stem: string; day: Weekday }> = [
  { stem: 'понед', day: 'Понедельник' },
  { stem: 'вторн', day: 'Вторник' },
  { stem: 'сред', day: 'Среда' },
  { stem: 'четвер', day: 'Четверг' },
  { stem: 'пятниц', day: 'Пятница' },
];

const DAY_SHORT: Record<string, Weekday> = {
  пн: 'Понедельник',
  вт: 'Вторник',
  ср: 'Среда',
  чт: 'Четверг',
  пт: 'Пятница',
};

/** Возвращает каноническое название учебного дня или undefined. */
export function canonicalDay(value: string): Weekday | undefined {
  const normalized = value.trim().toLocaleLowerCase('ru-RU').replace(/ё/g, 'е');
  if (!normalized) {
    return undefined;
  }

  const exact = WEEKDAYS.find(
    (day) => day.toLocaleLowerCase('ru-RU') === normalized,
  );
  if (exact) {
    return exact;
  }

  if (DAY_SHORT[normalized]) {
    return DAY_SHORT[normalized];
  }

  return DAY_STEMS.find(({ stem }) => normalized.includes(stem))?.day;
}

/** Приводит время из query-параметра к виду HH:mm. */
export function normalizeTimeValue(value: string): string | undefined {
  const match = value.trim().match(/^(\d{1,2})(?:[:.](\d{2}))?$/);
  if (!match) {
    return undefined;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  if (hours > 23 || minutes > 59) {
    return undefined;
  }
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

export function weekdayFromDate(date: Date): Weekday | undefined {
  const jsDay = date.getDay();
  if (jsDay < 1 || jsDay > 5) {
    return undefined;
  }
  return WEEKDAYS[jsDay - 1];
}

export function weekdayNameFromDate(date: Date): string {
  const names = [
    'воскресенье',
    'понедельник',
    'вторник',
    'среда',
    'четверг',
    'пятница',
    'суббота',
  ];
  return names[date.getDay()];
}
