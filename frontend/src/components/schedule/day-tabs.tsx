'use client';

import { CalendarRange } from 'lucide-react';
import { WEEKDAYS, WEEKDAY_SHORT, type Weekday } from '@/types/schedule';
import styles from './day-tabs.module.css';

interface DayTabsProps {
  value?: Weekday;
  onChange: (day: Weekday | undefined) => void;
}

export function DayTabs({ value, onChange }: DayTabsProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>
        <CalendarRange size={15} />
        День недели
      </span>

      <div className={styles.tabs} role="group" aria-label="Фильтр по дню недели">
        <button
          type="button"
          className={`${styles.tab} ${!value ? styles.tabActive : ''}`}
          aria-pressed={!value}
          onClick={() => onChange(undefined)}
        >
          Вся неделя
        </button>

        {WEEKDAYS.map((day) => (
          <button
            key={day}
            type="button"
            className={`${styles.tab} ${
              value === day ? styles.tabActive : ''
            }`}
            aria-pressed={value === day}
            onClick={() => onChange(day)}
          >
            <span className={styles.dayFull}>{day}</span>
            <span className={styles.dayShort}>{WEEKDAY_SHORT[day]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
