import { Injectable } from '@nestjs/common';
import { Lesson, Prisma } from '@prisma/client';
import { normalizeClassName, normalizeText } from '../common/text.utils';
import {
  FilterOptions,
  LessonFilters,
  LessonResponse,
} from './filters.types';
import { WEEKDAYS } from '../common/schedule.constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FiltersService {
  constructor(private readonly prisma: PrismaService) {}

  async findLessons(filters: LessonFilters): Promise<LessonResponse[]> {
    const where = this.buildWhere(filters);
    const lessons = await this.prisma.lesson.findMany({
      where,
      orderBy: [
        { dayOrder: 'asc' },
        { lessonNumber: 'asc' },
        { className: 'asc' },
      ],
    });

    return lessons.map((lesson) => this.toResponse(lesson));
  }

  async findLessonById(id: number): Promise<LessonResponse | null> {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    return lesson ? this.toResponse(lesson) : null;
  }

  async getOptions(): Promise<FilterOptions> {
    const [classes, subjects, lessonNumbers] = await Promise.all([
      this.prisma.lesson.findMany({
        select: { className: true },
        distinct: ['className'],
      }),
      this.prisma.lesson.findMany({
        select: { subject: true },
        distinct: ['subject'],
      }),
      this.prisma.lesson.findMany({
        select: { lessonNumber: true },
        distinct: ['lessonNumber'],
        orderBy: { lessonNumber: 'asc' },
      }),
    ]);

    const byRussianLocale = new Intl.Collator('ru-RU', {
      sensitivity: 'base',
    }).compare;
    const byNaturalClassOrder = new Intl.Collator('ru-RU', {
      numeric: true,
      sensitivity: 'base',
    }).compare;

    return {
      classes: classes
        .map((item) => item.className)
        .sort(byNaturalClassOrder),
      subjects: subjects.map((item) => item.subject).sort(byRussianLocale),
      days: [...WEEKDAYS],
      lessonNumbers: lessonNumbers.map((item) => item.lessonNumber),
    };
  }

  private buildWhere(filters: LessonFilters): Prisma.LessonWhereInput {
    const where: Prisma.LessonWhereInput = {};

    if (filters.day) {
      where.day = filters.day;
    }

    if (filters.className) {
      where.classNameNormalized = normalizeClassName(filters.className);
    }

    const exactSubject = filters.subjects?.length
      ? {
          in: filters.subjects.map((subject) => normalizeText(subject)),
        }
      : filters.subject
        ? normalizeText(filters.subject)
        : undefined;

    if (exactSubject && filters.search) {
      where.AND = [
        { subjectNormalized: exactSubject },
        { subjectNormalized: { contains: normalizeText(filters.search) } },
      ];
    } else if (exactSubject) {
      where.subjectNormalized = exactSubject;
    } else if (filters.search) {
      where.subjectNormalized = { contains: normalizeText(filters.search) };
    }

    if (filters.room) {
      where.room = { contains: filters.room.trim() };
    }

    if (filters.startAfter || filters.startBefore) {
      where.startTime = {
        ...(filters.startAfter ? { gt: filters.startAfter } : {}),
        ...(filters.startBefore ? { lt: filters.startBefore } : {}),
      };
    }
    if (filters.endAfter || filters.endBefore) {
      where.endTime = {
        ...(filters.endAfter ? { gt: filters.endAfter } : {}),
        ...(filters.endBefore ? { lt: filters.endBefore } : {}),
      };
    }
    if (filters.lessonNumber !== undefined) {
      where.lessonNumber = filters.lessonNumber;
    }

    return where;
  }

  private toResponse(lesson: Lesson): LessonResponse {
    return {
      id: lesson.id,
      day: lesson.day,
      dayOrder: lesson.dayOrder,
      lessonNumber: lesson.lessonNumber,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      subject: lesson.subject,
      className: lesson.className,
      room: lesson.room,
    };
  }
}
