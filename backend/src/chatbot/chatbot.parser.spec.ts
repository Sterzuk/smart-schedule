import { parseChatMessage, type ChatParserContext } from './chatbot.parser';

const context: ChatParserContext = {
  classes: ['10-Б'],
  // Понедельник, 2 ноября 2026 года, 10:00.
  now: new Date(2026, 10, 2, 10, 0, 0),
};

function parse(message: string, overrides: Partial<ChatParserContext> = {}) {
  return parseChatMessage(message, { ...context, ...overrides });
}

describe('parseChatMessage', () => {
  describe('фильтры расписания', () => {
    it('распознаёт класс и день недели', () => {
      const result = parse('Покажи расписание 10-Б на понедельник');

      expect(result.intent).toBe('find_lessons');
      expect(result.filters).toEqual({
        day: 'Понедельник',
        className: '10-Б',
      });
    });

    it('принимает класс без дефиса и с латинской буквой', () => {
      expect(parse('Что у 10 b во вторник?').filters).toMatchObject({
        day: 'Вторник',
        className: '10-Б',
      });
    });

    it('не принимает 1-Б за 10-Б', () => {
      expect(parse('Расписание 1-Б на среду').filters.className).toBeUndefined();
    });

    it('распознаёт группу математических предметов', () => {
      const result = parse('Когда математика у 10-Б?');

      expect(result.intent).toBe('find_lessons');
      expect(result.filters.className).toBe('10-Б');
      expect(result.filters.subjects).toEqual([
        'Алгебра',
        'Геометрия',
        'Вероятность и статистика',
      ]);
      expect(result.subjectLabels).toEqual(['математики']);
    });

    it('различает физику и физическую культуру', () => {
      expect(parse('Уроки физики в пятницу').filters.subjects).toEqual([
        'Физика',
      ]);
      expect(parse('Когда физра?').filters.subjects).toEqual([
        'Физическая культура',
      ]);
    });

    it('находит информатику и её учебный курс', () => {
      expect(parse('информатика у 10-Б').filters.subjects).toEqual([
        'Информатика',
        'УК Информатика',
      ]);
    });

    it('распознаёт кабинет', () => {
      expect(parse('Что идёт в кабинете 301?').filters.room).toBe('301');
      expect(parse('Уроки в 205 кабинете').filters.room).toBe('205');
    });

    it('распознаёт номер урока', () => {
      expect(parse('Какой предмет шестым уроком у 10-Б?').filters).toMatchObject({
        className: '10-Б',
        lessonNumber: 6,
      });
    });
  });

  describe('время', () => {
    it('преобразует «после 13:00» в начало после 13:00', () => {
      expect(parse('Какие уроки после 13:00?').filters.startAfter).toBe(
        '13:00',
      );
    });

    it('преобразует «до 14:00» в окончание до 14:00', () => {
      expect(parse('Какие уроки до 14:00?').filters.endBefore).toBe('14:00');
    });

    it('понимает время начала с явным глаголом', () => {
      const result = parse('Что у 10-Б в среду начинается после 13:00?');

      expect(result.filters).toMatchObject({
        className: '10-Б',
        day: 'Среда',
        startAfter: '13:00',
      });
      expect(result.filters.endAfter).toBeUndefined();
    });

    it('понимает время окончания с явным глаголом', () => {
      const result = parse('Что заканчивается после 14:00?');

      expect(result.filters).toEqual({ endAfter: '14:00' });
    });

    it('разбирает временной диапазон', () => {
      expect(parse('Уроки с 10:00 до 12:00').filters).toEqual({
        startAfter: '10:00',
        startBefore: '12:00',
      });
    });

    it('принимает время без минут и с точкой', () => {
      expect(parse('Уроки после 9').filters.startAfter).toBe('09:00');
      expect(parse('Уроки после 9.30').filters.startAfter).toBe('09:30');
    });
  });

  describe('специальные сценарии', () => {
    it('понимает «сегодня» для учебного дня', () => {
      expect(parse('Что сегодня у 10-Б?').filters).toMatchObject({
        day: 'Понедельник',
        className: '10-Б',
      });
    });

    it('понимает «завтра» для учебного дня', () => {
      expect(parse('Что завтра?').filters).toMatchObject({
        day: 'Вторник',
      });
    });

    it('возвращает off_day для выходного', () => {
      const result = parse('Что в воскресенье?');

      expect(result.intent).toBe('off_day');
      expect(result.offDayLabel).toBe('В воскресенье');
    });

    it('возвращает off_day для сегодняшнего воскресенья', () => {
      const result = parse('Что сегодня?', {
        now: new Date(2026, 10, 1, 10, 0, 0),
      });

      expect(result.intent).toBe('off_day');
      expect(result.offDayLabel).toBe('Сегодня воскресенье');
    });

    it.each([
      ['Привет!', 'greeting'],
      ['Что ты умеешь?', 'help'],
      ['Спасибо!', 'thanks'],
      ['Расскажи анекдот', 'unrecognized'],
    ] as const)('определяет интент для «%s»', (message, intent) => {
      const result = parse(message);

      expect(result.intent).toBe(intent);
      expect(result.filters).toEqual({});
    });

    it('считает общий запрос про уроки поиском расписания', () => {
      expect(parse('Покажи уроки').intent).toBe('find_lessons');
    });
  });
});
