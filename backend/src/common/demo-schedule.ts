import type { Prisma } from '@prisma/client';
import {
  DAY_ORDER,
  LESSON_TIMES,
  WEEKDAYS,
  Weekday,
} from './schedule.constants';
import { normalizeClassName, normalizeText } from './text.utils';

type LessonBlueprint = [subject: string, room: string];
type WeekPlan = Record<Weekday, LessonBlueprint[]>;

const schedule10B: WeekPlan = {
  Понедельник: [
    ['Разговор о важном', '105'],
    ['Химия', '209'],
    ['Английский язык', '327/124'],
    ['Физическая культура', 'Спортзал'],
    ['Русский язык', '105'],
    ['Литература', '106'],
    ['Алгебра', '205/304'],
    ['Алгебра', '205/304'],
  ],
  Вторник: [
    ['Физика', '301'],
    ['Индивидуальный проект', 'Общий'],
    ['Геометрия', '205/304'],
    ['Геометрия', '205/304'],
    ['История', '111'],
    ['Литература', '310'],
  ],
  Среда: [
    ['ОБЗР', '310'],
    ['Биология', '108'],
    ['Английский язык', '327/124'],
    ['Русский язык', '405'],
    ['Алгебра', '205/304'],
    ['Физика', '301'],
    ['Физика', '301'],
    ['ВД Физический практикум', '301'],
  ],
  Четверг: [
    ['История', '111'],
    ['Обществознание', '111'],
    ['Геометрия', '205/304'],
    ['География', '105'],
    ['Литература', '310'],
    ['Информатика', '401/414'],
    ['УК Информатика', '401/414'],
    ['Россия — мои горизонты', '105'],
  ],
  Пятница: [
    ['Физика', '301'],
    ['Физика', '301'],
    ['Английский язык', '327/124'],
    ['Алгебра', '205/304'],
    ['Вероятность и статистика', '205/304'],
    ['Физическая культура', 'Спортзал'],
    ['Обществознание', '111'],
  ],
};

const classes: Array<{ className: string; plan: WeekPlan }> = [
  { className: '10-Б', plan: schedule10B },
];

function buildLessons(): Prisma.LessonCreateManyInput[] {
  const lessons: Prisma.LessonCreateManyInput[] = [];

  for (const { className, plan } of classes) {
    for (const day of WEEKDAYS) {
      const dayPlan = plan[day];
      if (dayPlan.length > LESSON_TIMES.length) {
        throw new Error(`${className}, ${day}: слишком много уроков`);
      }

      dayPlan.forEach(([subject, room], index) => {
        const time = LESSON_TIMES[index];
        lessons.push({
          day,
          dayOrder: DAY_ORDER[day],
          lessonNumber: time.lessonNumber,
          startTime: time.startTime,
          endTime: time.endTime,
          subject,
          className,
          room,
          teacher: '',
          subjectNormalized: normalizeText(subject),
          classNameNormalized: normalizeClassName(className),
          teacherNormalized: '',
        });
      });
    }
  }

  return lessons;
}

function validateLessons(lessons: Prisma.LessonCreateManyInput[]): void {
  const lessonSlots = new Set<string>();
  const roomSlots = new Map<string, string>();

  for (const lesson of lessons) {
    const lessonKey = `${lesson.className}|${lesson.day}|${lesson.lessonNumber}`;
    if (lessonSlots.has(lessonKey)) {
      throw new Error(`Дублируется урок: ${lessonKey}`);
    }
    lessonSlots.add(lessonKey);

    if (lesson.room !== 'Общий') {
      const roomKey = `${lesson.room}|${lesson.day}|${lesson.lessonNumber}`;
      if (roomSlots.has(roomKey)) {
        throw new Error(
          `Конфликт кабинета: ${roomKey} (${roomSlots.get(roomKey)} и ${lesson.className})`,
        );
      }
      roomSlots.set(roomKey, lesson.className);
    }
  }
}

/**
 * Единый источник демо-расписания 10-Б.
 * Используется и локальным seed-скриптом, и автоматическим заполнением
 * пустой базы при старте backend (например, на Layero).
 */
export function buildDemoLessons(): Prisma.LessonCreateManyInput[] {
  const lessons = buildLessons();
  validateLessons(lessons);
  return lessons;
}
