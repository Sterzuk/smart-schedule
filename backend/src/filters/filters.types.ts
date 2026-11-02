import { Weekday } from '../common/schedule.constants';

export interface LessonFilters {
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

export interface LessonResponse {
  id: number;
  day: string;
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
