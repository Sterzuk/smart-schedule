import {
  weekdayFromDate,
  weekdayNameFromDate,
  normalizeTimeValue,
} from '../common/date.utils';
import { Weekday } from '../common/schedule.constants';
import { normalizeText } from '../common/text.utils';
import { LessonFilters } from '../filters/filters.types';

export type ChatIntent =
  | 'find_lessons'
  | 'greeting'
  | 'help'
  | 'thanks'
  | 'off_day'
  | 'unrecognized';

export interface ChatParserContext {
  classes: string[];
  now?: Date;
}

export interface ParsedChatMessage {
  intent: ChatIntent;
  filters: LessonFilters;
  subjectLabels: string[];
  offDayLabel?: string;
}

interface SubjectRule {
  id: string;
  label: string;
  labelGenitive: string;
  subjects: string[];
  patterns: RegExp[];
}

const SUBJECT_RULES: SubjectRule[] = [
  {
    id: 'physics-practicum',
    label: 'ВД Физический практикум',
    labelGenitive: 'физического практикума',
    subjects: ['ВД Физический практикум'],
    patterns: [/физическ[а-я]*\s+практикум/, /вд\s+физик/],
  },
  {
    id: 'math',
    label: 'Математика',
    labelGenitive: 'математики',
    subjects: ['Алгебра', 'Геометрия', 'Вероятность и статистика'],
    patterns: [/математик/],
  },
  {
    id: 'algebra',
    label: 'Алгебра',
    labelGenitive: 'алгебры',
    subjects: ['Алгебра'],
    patterns: [/алгебр/],
  },
  {
    id: 'geometry',
    label: 'Геометрия',
    labelGenitive: 'геометрии',
    subjects: ['Геометрия'],
    patterns: [/геометр/],
  },
  {
    id: 'probability',
    label: 'Вероятность и статистика',
    labelGenitive: 'вероятности и статистики',
    subjects: ['Вероятность и статистика'],
    patterns: [/вероятност/, /статистик/],
  },
  {
    id: 'russian',
    label: 'Русский язык',
    labelGenitive: 'русского языка',
    subjects: ['Русский язык'],
    patterns: [/русск/],
  },
  {
    id: 'literature',
    label: 'Литература',
    labelGenitive: 'литературы',
    subjects: ['Литература'],
    patterns: [/литератур/],
  },
  {
    id: 'english',
    label: 'Английский язык',
    labelGenitive: 'английского языка',
    subjects: ['Английский язык'],
    patterns: [/англ/],
  },
  {
    id: 'physics',
    label: 'Физика',
    labelGenitive: 'физики',
    subjects: ['Физика'],
    patterns: [/физик/],
  },
  {
    id: 'chemistry',
    label: 'Химия',
    labelGenitive: 'химии',
    subjects: ['Химия'],
    patterns: [/хими/],
  },
  {
    id: 'biology',
    label: 'Биология',
    labelGenitive: 'биологии',
    subjects: ['Биология'],
    patterns: [/биолог/],
  },
  {
    id: 'geography',
    label: 'География',
    labelGenitive: 'географии',
    subjects: ['География'],
    patterns: [/географ/],
  },
  {
    id: 'history',
    label: 'История',
    labelGenitive: 'истории',
    subjects: ['История'],
    patterns: [/истори/],
  },
  {
    id: 'social',
    label: 'Обществознание',
    labelGenitive: 'обществознания',
    subjects: ['Обществознание'],
    patterns: [/обществ/],
  },
  {
    id: 'informatics',
    label: 'Информатика',
    labelGenitive: 'информатики',
    subjects: ['Информатика', 'УК Информатика'],
    patterns: [/информатик/],
  },
  {
    id: 'pe',
    label: 'Физическая культура',
    labelGenitive: 'физической культуры',
    subjects: ['Физическая культура'],
    patterns: [/физкультур/, /физра/, /физическ[а-я]*\s+культур/],
  },
  {
    id: 'obzr',
    label: 'ОБЗР',
    labelGenitive: 'ОБЗР',
    subjects: ['ОБЗР'],
    patterns: [/(?:^|[^а-я])обзр(?:[^а-я]|$)/, /(?:^|[^а-я])обж(?:[^а-я]|$)/],
  },
  {
    id: 'project',
    label: 'Индивидуальный проект',
    labelGenitive: 'индивидуального проекта',
    subjects: ['Индивидуальный проект'],
    patterns: [/индивидуальн[а-я]*\s+проект/, /(?:^|[^а-я])проект(?:[^а-я]|$)/],
  },
  {
    id: 'important-talk',
    label: 'Разговор о важном',
    labelGenitive: 'разговора о важном',
    subjects: ['Разговор о важном'],
    patterns: [/разговор[а-я]*\s+о\s+важном/, /(?:^|[^а-я])ров(?:[^а-я]|$)/],
  },
  {
    id: 'russia-horizons',
    label: 'Россия — мои горизонты',
    labelGenitive: '«Россия — мои горизонты»',
    subjects: ['Россия — мои горизонты'],
    patterns: [/горизонт/, /росси[а-я]*\s+мои/],
  },
];

const TIME = '(\\d{1,2})(?:[:.](\\d{2}))?';

function extractTime(match: RegExpMatchArray): string | undefined {
  const raw = `${match[1]}:${match[2] ?? '00'}`;
  return normalizeTimeValue(raw);
}

function matchFirstTime(
  patterns: RegExp[],
  text: string,
): string | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const time = extractTime(match);
      if (time) {
        return time;
      }
    }
  }
  return undefined;
}

function detectSubjectRules(text: string): SubjectRule[] {
  return SUBJECT_RULES.filter((rule) =>
    rule.patterns.some((pattern) => pattern.test(text)),
  );
}

function detectClass(text: string, classes: string[]): string | undefined {
  for (const className of classes) {
    const number = className.match(/^(\d{1,2})/)?.[1];
    const letter = className.trim().slice(-1).toLocaleLowerCase('ru-RU');
    if (!number) {
      continue;
    }
    const letterPattern =
      letter === 'а' ? '[аa]' : letter === 'б' ? '[бb]' : letter;
    const regex = new RegExp(
      `(?:^|[^0-9a-zа-я])${number}\\s*[-–—]?\\s*${letterPattern}(?![0-9a-zа-я])`,
      'i',
    );
    if (regex.test(text)) {
      return className;
    }
  }
  return undefined;
}

function detectRoom(text: string): string | undefined {
  const match =
    text.match(/(?:кабинет[а-я]*|каб\.?)\s*№?\s*(\d{2,3}[а-яa-z]?)/) ??
    text.match(/(?:в|во)\s+(\d{2,3})\s+кабинет[а-я]*/);
  return match?.[1].toUpperCase();
}

function detectDay(
  text: string,
  now: Date,
): { day?: Weekday; offDayLabel?: string; explicitDay: boolean } {
  const dayStems: Array<{ pattern: RegExp; day: Weekday }> = [
    { pattern: /понед/, day: 'Понедельник' },
    { pattern: /вторник/, day: 'Вторник' },
    { pattern: /сред[а-я]*/, day: 'Среда' },
    { pattern: /четверг/, day: 'Четверг' },
    { pattern: /пятниц/, day: 'Пятница' },
  ];

  for (const item of dayStems) {
    if (item.pattern.test(text)) {
      return { day: item.day, explicitDay: true };
    }
  }

  const abbreviations: Array<[RegExp, Weekday]> = [
    [/(?:^|\s)пн(?=\s|$|[,.!?])/, 'Понедельник'],
    [/(?:^|\s)вт(?=\s|$|[,.!?])/, 'Вторник'],
    [/(?:^|\s)ср(?=\s|$|[,.!?])/, 'Среда'],
    [/(?:^|\s)чт(?=\s|$|[,.!?])/, 'Четверг'],
    [/(?:^|\s)пт(?=\s|$|[,.!?])/, 'Пятница'],
  ];
  for (const [pattern, day] of abbreviations) {
    if (pattern.test(text)) {
      return { day, explicitDay: true };
    }
  }

  if (text.includes('сегодня')) {
    const today = weekdayFromDate(now);
    return today
      ? { day: today, explicitDay: false }
      : {
          explicitDay: false,
          offDayLabel: `Сегодня ${weekdayNameFromDate(now)}`,
        };
  }

  if (text.includes('завтра')) {
    const tomorrowDate = new Date(now);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = weekdayFromDate(tomorrowDate);
    return tomorrow
      ? { day: tomorrow, explicitDay: false }
      : {
          explicitDay: false,
          offDayLabel: `Завтра ${weekdayNameFromDate(tomorrowDate)}`,
        };
  }

  if (/суббот/.test(text)) {
    return { explicitDay: false, offDayLabel: 'В субботу' };
  }
  if (/воскрес/.test(text)) {
    return { explicitDay: false, offDayLabel: 'В воскресенье' };
  }
  if (/выходн/.test(text)) {
    return { explicitDay: false, offDayLabel: 'На выходных' };
  }

  return { explicitDay: false };
}

function detectLessonNumber(text: string): number | undefined {
  const ordinals: Array<[RegExp, number]> = [
    [/(?:^|\s)перв[а-я]*\s+урок/, 1],
    [/(?:^|\s)втор[а-я]*\s+урок/, 2],
    [/(?:^|\s)трет[а-я]*\s+урок/, 3],
    [/(?:^|\s)четверт[а-я]*\s+урок/, 4],
    [/(?:^|\s)пят[а-я]*\s+урок/, 5],
    [/(?:^|\s)шест[а-я]*\s+урок/, 6],
    [/(?:^|\s)седьм[а-я]*\s+урок/, 7],
    [/(?:^|\s)восьм[а-я]*\s+урок/, 8],
  ];
  for (const [pattern, number] of ordinals) {
    if (pattern.test(text)) {
      return number;
    }
  }
  return undefined;
}

/**
 * Простой, но предсказуемый разбор естественного языка для MVP.
 * Не использует внешние AI-сервисы: распознаёт дни, классы, предметы,
 * кабинеты и временные ограничения.
 */
export function parseChatMessage(
  message: string,
  context: ChatParserContext,
): ParsedChatMessage {
  const text = normalizeText(message);
  const now = context.now ?? new Date();
  const filters: LessonFilters = {};
  const subjectRules = detectSubjectRules(text);
  const className = detectClass(text, context.classes);
  const room = detectRoom(text);
  const dayResult = detectDay(text, now);
  const lessonNumber = detectLessonNumber(text);

  if (dayResult.day) {
    filters.day = dayResult.day;
  }
  if (className) {
    filters.className = className;
  }
  if (room) {
    filters.room = room;
  }
  if (lessonNumber) {
    filters.lessonNumber = lessonNumber;
  }
  if (subjectRules.length) {
    filters.subjects = [
      ...new Set(subjectRules.flatMap((rule) => rule.subjects)),
    ];
  }

  const endAfter = matchFirstTime(
    [
      new RegExp(
        `(?:заканчива[а-я]*|оканчива[а-я]*|конча[а-я]*)\\s+(?:после|позже|позднее|поздней)\\s+${TIME}(?:[^а-я]|$)`,
      ),
    ],
    text,
  );
  const endBefore = matchFirstTime(
    [
      new RegExp(
        `(?:заканчива[а-я]*|оканчива[а-я]*|конча[а-я]*)\\s+(?:до|раньше|не\\s+позже)\\s+${TIME}(?:[^а-я]|$)`,
      ),
    ],
    text,
  );
  const startAfter = matchFirstTime(
    [
      new RegExp(
        `(?:начина[а-я]*|старту[а-я]*)\\s+(?:после|позже|позднее|поздней|не\\s+раньше)\\s+${TIME}(?:[^а-я]|$)`,
      ),
    ],
    text,
  );
  const startBefore = matchFirstTime(
    [
      new RegExp(
        `(?:начина[а-я]*|старту[а-я]*)\\s+(?:до|раньше|не\\s+позже)\\s+${TIME}(?:[^а-я]|$)`,
      ),
    ],
    text,
  );

  const rangeMatch = text.match(
    new RegExp(
      `(?:^|[^а-я])(?:с|между)\\s+${TIME}\\s*(?:до|и|по)\\s+${TIME}(?:[^а-я]|$)`,
    ),
  );

  if (endAfter) {
    filters.endAfter = endAfter;
  }
  if (endBefore) {
    filters.endBefore = endBefore;
  }
  if (startAfter) {
    filters.startAfter = startAfter;
  }
  if (startBefore) {
    filters.startBefore = startBefore;
  }

  if (rangeMatch) {
    const rangeStart = normalizeTimeValue(
      `${rangeMatch[1]}:${rangeMatch[2] ?? '00'}`,
    );
    const rangeEnd = normalizeTimeValue(
      `${rangeMatch[3]}:${rangeMatch[4] ?? '00'}`,
    );
    if (rangeStart && rangeEnd) {
      filters.startAfter = rangeStart;
      filters.startBefore = rangeEnd;
    }
  }

  const hasSpecificEndFilter = Boolean(endAfter || endBefore);
  const hasSpecificStartFilter = Boolean(startAfter || startBefore);

  if (!hasSpecificStartFilter && !hasSpecificEndFilter && !rangeMatch) {
    const genericAfter = matchFirstTime(
      [
        new RegExp(
          `(?:после|позже|позднее|поздней|не\\s+раньше)\\s+${TIME}(?:[^а-я]|$)`,
        ),
      ],
      text,
    );
    const genericBefore = matchFirstTime(
      [
        new RegExp(
          `(?:^|[^а-я])(?:до|раньше|не\\s+позже)\\s+${TIME}(?:[^а-я]|$)`,
        ),
      ],
      text,
    );

    if (genericAfter) {
      filters.startAfter = genericAfter;
    }
    if (genericBefore) {
      filters.endBefore = genericBefore;
    }
  }

  if (
    !rangeMatch &&
    !filters.startAfter &&
    !filters.startBefore &&
    !filters.endAfter
  ) {
    const fromMatch = text.match(
      /(?:^|[^а-я])(?:с|начиная\s+с)\s+(\d{1,2}):(\d{2})(?:[^а-я]|$)/,
    );
    if (fromMatch) {
      const fromTime = normalizeTimeValue(
        `${fromMatch[1]}:${fromMatch[2]}`,
      );
      if (fromTime) {
        filters.startAfter = fromTime;
      }
    }
  }

  const subjectLabels = subjectRules.map((rule) => rule.labelGenitive);

  if (dayResult.offDayLabel) {
    return {
      intent: 'off_day',
      filters,
      subjectLabels,
      offDayLabel: dayResult.offDayLabel,
    };
  }

  const hasFilters =
    Boolean(filters.day) ||
    Boolean(filters.className) ||
    Boolean(filters.subjects?.length) ||
    Boolean(filters.startAfter) ||
    Boolean(filters.startBefore) ||
    Boolean(filters.endAfter) ||
    Boolean(filters.endBefore) ||
    Boolean(filters.lessonNumber) ||
    Boolean(filters.room);

  const hasScheduleIntent =
    /расписани|урок|заняти|пар[аыу]|когда|во\s+сколько|предмет|недел|учебн/.test(
      text,
    );

  if (
    !hasFilters &&
    /помощь|помоги|что\s+ты\s+умеешь|как\s+пользоваться|как\s+работа|команд/.test(
      text,
    )
  ) {
    return { intent: 'help', filters, subjectLabels };
  }

  if (
    !hasFilters &&
    /^(привет|здравствуй|здравствуйте|доброе\s+утро|добрый\s+день|добрый\s+вечер|хай|hello|hi)[!., ]*$/.test(
      text,
    )
  ) {
    return { intent: 'greeting', filters, subjectLabels };
  }

  if (
    !hasFilters &&
    /спасибо|благодар|thanks|thank\s+you/.test(text)
  ) {
    return { intent: 'thanks', filters, subjectLabels };
  }

  if (hasFilters || hasScheduleIntent) {
    return { intent: 'find_lessons', filters, subjectLabels };
  }

  return { intent: 'unrecognized', filters, subjectLabels };
}
