import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Lightbulb,
  MessageSquareText,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { Chat } from '@/components/chat';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Чат-бот',
  description:
    'Спросите чат-бота о расписании обычным языком: по классу, дню, предмету или времени.',
};

const ABILITIES = [
  { icon: CalendarDays, text: 'Дни недели и вся неделя' },
  { icon: GraduationCap, text: 'Класс 10-Б' },
  { icon: MessageSquareText, text: 'Предметы и их названия-синонимы' },
  { icon: Clock3, text: 'Время начала и окончания' },
];

const TIPS = [
  'Уточняйте класс и день в одном запросе — ответ будет точнее.',
  'Пишите «после 13:00» или «до 14:00» для фильтра по времени.',
  'Бот понимает «сегодня» и «завтра», если это учебный день.',
];

export default function ChatPage() {
  return (
    <div className={styles.page}>
      <div className={styles.background} aria-hidden="true" />

      <div className="container">
        <div className={styles.pageHeader}>
          <span className={styles.eyebrow}>
            <Sparkles size={14} />
            ассистент расписания
          </span>
          <h1>Спросите. Найдите. Готово.</h1>
          <p>
            Напишите, какие уроки вам нужны. Бот разберёт запрос, обратится к
            общей базе расписания и вернёт только подходящие занятия.
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.chatShell}>
            <Chat variant="page" />
          </div>

          <aside className={styles.aside}>
            <section className={styles.infoCard}>
              <div className={styles.cardHeading}>
                <span className={styles.cardIcon}>
                  <CheckCircle2 size={18} />
                </span>
                <div>
                  <h2>Что умеет бот</h2>
                  <p>Понимает контекст расписания</p>
                </div>
              </div>

              <ul className={styles.abilityList}>
                {ABILITIES.map(({ icon: Icon, text }) => (
                  <li key={text}>
                    <Icon size={15} />
                    {text}
                  </li>
                ))}
              </ul>

              <div className={styles.exampleBlock}>
                <span className={styles.exampleLabel}>Пример запроса</span>
                <p>«Какие уроки у 10-Б в среду начинаются после 13:00?»</p>
              </div>
            </section>

            <section className={styles.tipsCard}>
              <div className={styles.tipsHeading}>
                <span className={styles.tipsIcon}>
                  <Lightbulb size={17} />
                </span>
                <h2>Короткие подсказки</h2>
              </div>
              <ul className={styles.tipList}>
                {TIPS.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>

            <section className={styles.scheduleCard}>
              <span className={styles.scheduleIcon}>
                <SlidersHorizontal size={19} />
              </span>
              <h2>Нужен подробный обзор?</h2>
              <p>
                Откройте расписание: там доступны таблица, дни недели и
                комбинируемые фильтры.
              </p>
              <Link href="/schedule" className={styles.scheduleLink}>
                Перейти к расписанию
                <ArrowRight size={15} />
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
