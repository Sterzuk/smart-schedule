import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  DoorOpen,
  Hash,
} from 'lucide-react';
import type { Lesson } from '@/types/schedule';
import styles from './lesson-results.module.css';

interface LessonResultsProps {
  lessons: Lesson[];
}

function pluralizeLessons(count: number): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'уроков';
  if (mod10 === 1) return 'урок';
  if (mod10 >= 2 && mod10 <= 4) return 'урока';
  return 'уроков';
}

export function LessonResults({ lessons }: LessonResultsProps) {
  const groups = new Map<string, Lesson[]>();
  for (const lesson of lessons) {
    const group = groups.get(lesson.day) ?? [];
    group.push(lesson);
    groups.set(lesson.day, group);
  }

  const isLongList = lessons.length > 8;

  return (
    <div className={styles.results}>
      <div className={styles.resultsHeader}>
        <span className={styles.resultsCount}>
          <CalendarDays size={15} />
          {lessons.length} {pluralizeLessons(lessons.length)}
        </span>
        <Link href="/schedule" className={styles.openLink}>
          В расписании
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <div
        className={`${styles.lessonList} ${
          isLongList ? styles.lessonListScrollable : ''
        }`}
      >
        {[...groups.entries()].map(([day, dayLessons]) => (
          <section key={day} className={styles.dayGroup}>
            <h4 className={styles.dayTitle}>{day}</h4>
            <div className={styles.dayLessons}>
              {dayLessons.map((lesson) => (
                <article key={lesson.id} className={styles.lessonCard}>
                  <div className={styles.timeBlock}>
                    <span className={styles.startTime}>
                      {lesson.startTime}
                    </span>
                    <span className={styles.endTime}>{lesson.endTime}</span>
                  </div>

                  <div className={styles.lessonMain}>
                    <div className={styles.lessonTop}>
                      <span className={styles.subject}>{lesson.subject}</span>
                      <span className={styles.classBadge}>
                        {lesson.className}
                      </span>
                    </div>
                    <div className={styles.lessonMeta}>
                      <span>
                        <DoorOpen size={13} />
                        каб. {lesson.room}
                      </span>
                      <span>
                        {lesson.className}
                      </span>
                    </div>
                  </div>

                  <div className={styles.lessonSide}>
                    <span className={styles.lessonNumber}>
                      <Hash size={12} />
                      {lesson.lessonNumber}
                    </span>
                    <span className={styles.clockIcon}>
                      <Clock3 size={13} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
