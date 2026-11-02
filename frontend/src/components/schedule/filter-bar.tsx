'use client';

import {
  ChevronDown,
  Clock3,
  GraduationCap,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import type {
  FilterOptions,
  ScheduleFilters,
} from '@/types/schedule';
import styles from './filter-bar.module.css';

interface FilterBarProps {
  filters: ScheduleFilters;
  options: FilterOptions;
  onChange: <K extends keyof ScheduleFilters>(
    key: K,
    value: ScheduleFilters[K],
  ) => void;
  onReset: () => void;
}

export function FilterBar({
  filters,
  options,
  onChange,
  onReset,
}: FilterBarProps) {
  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div className={styles.filters}>
      <div className={styles.field}>
        <label htmlFor="subject-search" className={styles.label}>
          Поиск по предмету
        </label>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.fieldIcon} />
          <input
            id="subject-search"
            type="search"
            className={styles.searchInput}
            placeholder="Например, физика"
            value={filters.search ?? ''}
            onChange={(event) =>
              onChange('search', event.target.value || undefined)
            }
            maxLength={100}
          />
          {filters.search && (
            <button
              type="button"
              className={styles.clearSearch}
              aria-label="Очистить поиск по предмету"
              onClick={() => onChange('search', undefined)}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="class-filter" className={styles.label}>
          Класс
        </label>
        <div className={styles.selectWrapper}>
          <GraduationCap size={15} className={styles.fieldIcon} />
          <select
            id="class-filter"
            className={styles.select}
            value={filters.className ?? ''}
            onChange={(event) =>
              onChange('className', event.target.value || undefined)
            }
          >
            <option value="">Все классы</option>
            {options.classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className={styles.chevron} />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="start-after" className={styles.label}>
          Начало после
        </label>
        <div className={styles.timeWrapper}>
          <Clock3 size={15} className={styles.fieldIcon} />
          <input
            id="start-after"
            type="time"
            className={styles.timeInput}
            value={filters.startAfter ?? ''}
            onChange={(event) =>
              onChange('startAfter', event.target.value || undefined)
            }
          />
          {filters.startAfter && (
            <button
              type="button"
              className={styles.clearTime}
              aria-label="Сбросить фильтр по времени"
              onClick={() => onChange('startAfter', undefined)}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        className={styles.resetButton}
        onClick={onReset}
        disabled={!hasFilters}
      >
        <RotateCcw size={14} />
        Сбросить
      </button>
    </div>
  );
}
