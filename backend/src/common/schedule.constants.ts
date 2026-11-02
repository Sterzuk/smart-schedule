export const WEEKDAYS = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export const DAY_ORDER: Record<Weekday, number> = {
  Понедельник: 1,
  Вторник: 2,
  Среда: 3,
  Четверг: 4,
  Пятница: 5,
};

export const DAY_PREPOSITIONAL: Record<Weekday, string> = {
  Понедельник: 'понедельник',
  Вторник: 'вторник',
  Среда: 'среду',
  Четверг: 'четверг',
  Пятница: 'пятницу',
};

export const DAY_GENITIVE: Record<Weekday, string> = {
  Понедельник: 'понедельника',
  Вторник: 'вторника',
  Среда: 'среды',
  Четверг: 'четверга',
  Пятница: 'пятницы',
};

export const LESSON_TIMES = [
  { lessonNumber: 1, startTime: '08:30', endTime: '09:15' },
  { lessonNumber: 2, startTime: '09:25', endTime: '10:10' },
  { lessonNumber: 3, startTime: '10:20', endTime: '11:05' },
  { lessonNumber: 4, startTime: '11:15', endTime: '12:00' },
  { lessonNumber: 5, startTime: '12:10', endTime: '12:55' },
  { lessonNumber: 6, startTime: '13:05', endTime: '13:50' },
  { lessonNumber: 7, startTime: '14:00', endTime: '14:45' },
  { lessonNumber: 8, startTime: '14:55', endTime: '15:40' },
] as const;
