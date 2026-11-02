import { DoorOpen, GraduationCap } from 'lucide-react';
import type { Lesson } from '@/types/schedule';
import styles from './schedule-table.module.css';

interface ScheduleTableProps {
  lessons: Lesson[];
}

export function ScheduleTable({ lessons }: ScheduleTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className="sr-only">
          Расписание уроков с фильтрами по дню, классу и времени
        </caption>
        <thead>
          <tr>
            <th scope="col">День</th>
            <th scope="col" className={styles.centerCell}>
              №
            </th>
            <th scope="col">Начало</th>
            <th scope="col">Окончание</th>
            <th scope="col">Предмет</th>
            <th scope="col">Класс</th>
            <th scope="col">Кабинет</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson.id}>
              <td>
                <span className={styles.dayPill}>{lesson.day}</span>
              </td>
              <td className={styles.centerCell}>
                <span className={styles.lessonNumber}>
                  {lesson.lessonNumber}
                </span>
              </td>
              <td>
                <span className={styles.time}>{lesson.startTime}</span>
              </td>
              <td>
                <span className={styles.endTime}>{lesson.endTime}</span>
              </td>
              <td>
                <strong className={styles.subject}>{lesson.subject}</strong>
              </td>
              <td>
                <span className={styles.classBadge}>
                  <GraduationCap size={12} />
                  {lesson.className}
                </span>
              </td>
              <td>
                <span className={styles.metaCell}>
                  <DoorOpen size={13} />
                  {lesson.room}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ScheduleCards({ lessons }: ScheduleTableProps) {
  return (
    <div className={styles.cards}>
      {lessons.map((lesson) => (
        <article key={lesson.id} className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.cardDay}>{lesson.day}</span>
            <span className={styles.cardNumber}>
              Урок {lesson.lessonNumber}
            </span>
          </div>

          <div className={styles.cardMain}>
            <div className={styles.cardTime}>
              <strong>{lesson.startTime}</strong>
              <span>{lesson.endTime}</span>
            </div>
            <div className={styles.cardSubjectBlock}>
              <h3>{lesson.subject}</h3>
              <span className={styles.classBadge}>
                <GraduationCap size={12} />
                {lesson.className}
              </span>
            </div>
          </div>

          <div className={styles.cardMeta}>
            <span>
              <DoorOpen size={14} />
              Кабинет {lesson.room}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
