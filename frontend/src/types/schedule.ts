export const WEEKDAYS = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export const WEEKDAY_SHORT: Record<Weekday, string> = {
  Понедельник: 'Пн',
  Вторник: 'Вт',
  Среда: 'Ср',
  Четверг: 'Чт',
  Пятница: 'Пт',
};

export interface Lesson {
  id: number;
  day: Weekday;
  dayOrder: number;
  lessonNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  className: string;
  room: string;
}

export interface FilterOptions {
  classes: string[];
  subjects: string[];
  days: Weekday[];
  lessonNumbers: number[];
}

export interface AppliedFilters {
  day?: Weekday;
  className?: string;
  subject?: string;
  subjects?: string[];
  search?: string;
  room?: string;
  startAfter?: string;
  startBefore?: string;
  endAfter?: string;
  endBefore?: string;
  lessonNumber?: number;
}

export interface ScheduleFilters {
  day?: Weekday;
  className?: string;
  search?: string;
  startAfter?: string;
  startBefore?: string;
  endAfter?: string;
  endBefore?: string;
  lessonNumber?: number;
  room?: string;
}

export interface ScheduleApiResponse {
  success: true;
  lessons: Lesson[];
  total: number;
  appliedFilters: AppliedFilters;
  options: FilterOptions;
}

export interface ChatApiResponse {
  success: true;
  reply: string;
  lessons: Lesson[];
  total: number;
  appliedFilters: AppliedFilters;
  suggestions: string[];
  intent:
    | 'find_lessons'
    | 'greeting'
    | 'help'
    | 'thanks'
    | 'off_day'
    | 'unrecognized';
}

export interface ApiErrorPayload {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string[];
  };
}
