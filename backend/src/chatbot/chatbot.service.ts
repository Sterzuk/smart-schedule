import { Injectable } from '@nestjs/common';
import { DAY_PREPOSITIONAL } from '../common/schedule.constants';
import { pluralizeRu } from '../common/text.utils';
import { FiltersService } from '../filters/filters.service';
import {
  AppliedFilters,
  LessonResponse,
} from '../filters/filters.types';
import {
  ChatIntent,
  ParsedChatMessage,
  parseChatMessage,
} from './chatbot.parser';

export interface ChatResult {
  reply: string;
  lessons: LessonResponse[];
  total: number;
  appliedFilters: AppliedFilters;
  suggestions: string[];
  intent: ChatIntent;
}

const DEFAULT_SUGGESTIONS = [
  'Расписание 10-Б на понедельник',
  'Какие уроки начинаются после 13:00?',
  'Что у 10-Б в пятницу?',
];

@Injectable()
export class ChatbotService {
  constructor(private readonly filtersService: FiltersService) {}

  async handle(message: string): Promise<ChatResult> {
    const options = await this.filtersService.getOptions();
    const parsed = parseChatMessage(message, {
      classes: options.classes,
      now: new Date(),
    });

    if (parsed.intent === 'off_day') {
      return {
        reply: `${parsed.offDayLabel ?? 'В этот день'} — занятий нет. В расписании только учебные дни с понедельника по пятницу.`,
        lessons: [],
        total: 0,
        appliedFilters: {},
        suggestions: [
          'Расписание 10-Б на понедельник',
          'Какие уроки во вторник?',
          'Расписание 10-Б на среду',
        ],
        intent: parsed.intent,
      };
    }

    if (parsed.intent === 'greeting') {
      return this.staticResult(
        'Здравствуйте! Я помощник «Умного расписания». Могу показать уроки по дню, классу, предмету или времени начала. С чего начнём?',
        parsed.intent,
      );
    }

    if (parsed.intent === 'help') {
      return this.staticResult(
        'Спросите меня обычным языком, например: «Расписание 10-Б на среду», «Какие уроки после 13:00?» или «Что у 10-Б в пятницу?». Я также понимаю слова «сегодня», «завтра», время и кабинеты. Если запрос сложный, откройте страницу «Расписание» и используйте фильтры.',
        parsed.intent,
      );
    }

    if (parsed.intent === 'thanks') {
      return this.staticResult(
        'Пожалуйста! Обращайтесь, если нужно найти ещё какие-нибудь уроки.',
        parsed.intent,
      );
    }

    if (parsed.intent === 'unrecognized') {
      return {
        reply:
          'Пока не понял запрос. Я лучше всего работаю с расписанием: могу найти уроки по классу, предмету, дню недели или времени. Например: «Расписание 10-Б на четверг» или «Какие уроки заканчиваются после 14:00?».',
        lessons: [],
        total: 0,
        appliedFilters: {},
        suggestions: DEFAULT_SUGGESTIONS,
        intent: parsed.intent,
      };
    }

    const lessons = await this.filtersService.findLessons(parsed.filters);
    const reply = this.buildReply(parsed, lessons);
    const suggestions =
      lessons.length > 0
        ? DEFAULT_SUGGESTIONS
        : [
            'Покажи всю неделю для 10-Б',
            'Какие уроки после 13:00?',
            'Расписание 10-Б на понедельник',
          ];

    return {
      reply,
      lessons,
      total: lessons.length,
      appliedFilters: this.publicFilters(parsed.filters),
      suggestions,
      intent: parsed.intent,
    };
  }

  private staticResult(reply: string, intent: ChatIntent): ChatResult {
    return {
      reply,
      lessons: [],
      total: 0,
      appliedFilters: {},
      suggestions: DEFAULT_SUGGESTIONS,
      intent,
    };
  }

  private buildReply(
    parsed: ParsedChatMessage,
    lessons: LessonResponse[],
  ): string {
    const { filters } = parsed;
    const count = lessons.length;
    const plural = pluralizeRu(count, 'урок', 'урока', 'уроков');

    if (count === 0) {
      return `По вашему запросу ${plural} не нашлось. Попробуйте выбрать другой день, класс или расширить временной диапазон.`;
    }

    const primary: string[] = [];
    if (parsed.subjectLabels.length) {
      primary.push(parsed.subjectLabels.join(' и '));
    }
    if (filters.day) {
      primary.push(`в ${DAY_PREPOSITIONAL[filters.day]}`);
    }
    if (filters.className) {
      primary.push(`для ${filters.className}`);
    }

    const details: string[] = [];
    if (filters.startAfter) {
      details.push(`Начало после ${filters.startAfter}`);
    }
    if (filters.startBefore) {
      details.push(`Начало до ${filters.startBefore}`);
    }
    if (filters.endAfter) {
      details.push(`Окончание после ${filters.endAfter}`);
    }
    if (filters.endBefore) {
      details.push(`Окончание до ${filters.endBefore}`);
    }
    if (filters.room) {
      details.push(`Кабинет: ${filters.room}`);
    }
    if (filters.lessonNumber) {
      details.push(`Урок № ${filters.lessonNumber}`);
    }

    let intro: string;
    if (!primary.length && !details.length) {
      intro = 'Вот всё расписание на неделю.';
    } else if (!primary.length) {
      intro = 'Вот подходящие уроки.';
    } else {
      intro = `Вот уроки ${primary.join(' ')}.`;
    }

    const detailsText = details.length
      ? ` ${details.join('. ')}.`
      : '';

    return `${intro}${detailsText} Найдено ${count} ${plural}.`;
  }

  private publicFilters(filters: ParsedChatMessage['filters']): AppliedFilters {
    const result: AppliedFilters = {};
    if (filters.day) result.day = filters.day;
    if (filters.className) result.className = filters.className;
    if (filters.subjects?.length) result.subjects = [...filters.subjects];
    if (filters.subject) result.subject = filters.subject;
    if (filters.search) result.search = filters.search;
    if (filters.room) result.room = filters.room;
    if (filters.startAfter) result.startAfter = filters.startAfter;
    if (filters.startBefore) result.startBefore = filters.startBefore;
    if (filters.endAfter) result.endAfter = filters.endAfter;
    if (filters.endBefore) result.endBefore = filters.endBefore;
    if (filters.lessonNumber !== undefined) {
      result.lessonNumber = filters.lessonNumber;
    }
    return result;
  }
}
