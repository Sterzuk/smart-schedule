'use client';

import Link from 'next/link';
import {
  AlertCircle,
  BookOpenCheck,
  CalendarDays,
  Database,
  GraduationCap,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
  SearchX,
  Server,
  Sparkles,
  X,
} from 'lucide-react';
import { useSchedule } from '@/hooks/useSchedule';
import type { ScheduleFilters, Weekday } from '@/types/schedule';
import { DayTabs } from './day-tabs';
import { FilterBar } from './filter-bar';
import { ScheduleCards, ScheduleTable } from './schedule-table';
import styles from './schedule-explorer.module.css';

function pluralLessons(count: number): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'уроков';
  if (mod10 === 1) return 'урок';
  if (mod10 >= 2 && mod10 <= 4) return 'урока';
  return 'уроков';
}

interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

export function ScheduleExplorer() {
  const {
    filters,
    lessons,
    options,
    isLoading,
    hasLoaded,
    error,
    updateFilter,
    resetFilters,
    retry,
    hasActiveFilters,
  } = useSchedule();

  const chips: FilterChip[] = [];
  if (filters.day) {
    chips.push({
      key: 'day',
      label: filters.day,
      onRemove: () => updateFilter('day', undefined),
    });
  }
  if (filters.search) {
    chips.push({
      key: 'search',
      label: `Предмет: ${filters.search}`,
      onRemove: () => updateFilter('search', undefined),
    });
  }
  if (filters.className) {
    chips.push({
      key: 'class',
      label: `Класс: ${filters.className}`,
      onRemove: () => updateFilter('className', undefined),
    });
  }
  if (filters.startAfter) {
    chips.push({
      key: 'time',
      label: `Начало после ${filters.startAfter}`,
      onRemove: () => updateFilter('startAfter', undefined),
    });
  }

  const handleDayChange = (day: Weekday | undefined) => {
    updateFilter('day', day);
  };

  const showSkeleton = (!hasLoaded && isLoading) || (!hasLoaded && !error);
  const showLoadError = Boolean(error) && !isLoading && lessons.length === 0;
  const showEmpty =
    !isLoading && !error && hasLoaded && lessons.length === 0;

  return (
    <div className={styles.page}>
      <div className={styles.background} aria-hidden="true" />

      <div className="container">
        <section className={styles.pageHeader}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>
              <CalendarDays size={14} />
              учебная неделя
            </span>
            <h1>Расписание уроков</h1>
            <p>
              Выберите день и уточните нужные параметры. Все фильтры
              применяются вместе, а данные приходят из общей базы backend.
            </p>
          </div>

          <div className={styles.stats} aria-label="Общие показатели расписания">
            <div className={styles.stat}>
              <span className={styles.statIcon}>
                <GraduationCap size={17} />
              </span>
              <strong>{options.classes.length || '—'}</strong>
              <span>класса</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon}>
                <CalendarDays size={17} />
              </span>
              <strong>{options.days.length || '—'}</strong>
              <span>учебных дня</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon}>
                <BookOpenCheck size={17} />
              </span>
              <strong>{options.subjects.length || '—'}</strong>
              <span>предметов</span>
            </div>
          </div>
        </section>

        <DayTabs value={filters.day} onChange={handleDayChange} />

        <FilterBar
          filters={filters}
          options={options}
          onChange={updateFilter}
          onReset={resetFilters}
        />

        {error && lessons.length > 0 && (
          <div className={styles.inlineError} role="alert">
            <AlertCircle size={17} />
            <span>{error}</span>
            <button type="button" onClick={retry}>
              Повторить
            </button>
          </div>
        )}

        <section
          className={styles.resultsPanel}
          aria-busy={isLoading}
          aria-label="Результаты расписания"
        >
          {isLoading && <span className={styles.progressBar} />}

          <div className={styles.resultsToolbar}>
            <div className={styles.resultsTitle}>
              <span className={styles.resultsIcon}>
                <Sparkles size={16} />
              </span>
              <div>
                <h2>Результаты</h2>
                <p>
                  {showSkeleton
                    ? 'Загружаем уроки…'
                    : showLoadError
                      ? 'Не удалось загрузить данные'
                      : `${lessons.length} ${pluralLessons(lessons.length)} по выбранным параметрам`}
                </p>
              </div>
            </div>

            <button
              type="button"
              className={styles.refreshButton}
              onClick={retry}
              disabled={isLoading}
            >
              <RefreshCw
                size={14}
                className={isLoading ? styles.spinning : undefined}
              />
              Обновить
            </button>
          </div>

          {chips.length > 0 && (
            <div className={styles.activeFilters}>
              <span className={styles.chipsLabel}>Активные фильтры:</span>
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  className={styles.chip}
                  onClick={chip.onRemove}
                  aria-label={`Убрать фильтр «${chip.label}»`}
                >
                  {chip.label}
                  <X size={12} />
                </button>
              ))}
              <button
                type="button"
                className={styles.clearAll}
                onClick={resetFilters}
              >
                Очистить всё
              </button>
            </div>
          )}

          {showSkeleton && (
            <div className={styles.skeleton} aria-label="Загрузка расписания">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className={styles.skeletonRow}>
                  <span className={styles.skeletonPill} />
                  <span className={styles.skeletonTime} />
                  <span className={styles.skeletonWide} />
                  <span className={styles.skeletonShort} />
                  <span className={styles.skeletonMedium} />
                </div>
              ))}
            </div>
          )}

          {showLoadError && (
            <div className={styles.stateBox} role="alert">
              <span className={styles.stateIconError}>
                <AlertCircle size={25} />
              </span>
              <h2>Сервер не отвечает</h2>
              <p>{error}</p>
              <button type="button" className={styles.retryButton} onClick={retry}>
                <LoaderCircle size={15} />
                Попробовать снова
              </button>
            </div>
          )}

          {showEmpty && (
            <div className={styles.stateBox}>
              <span className={styles.stateIcon}>
                <SearchX size={25} />
              </span>
              <h2>Подходящих уроков нет</h2>
              <p>
                Попробуйте изменить день, класс или время — возможно, нужный
                урок не попадает под выбранные параметры.
              </p>
              <div className={styles.emptyActions}>
                <button
                  type="button"
                  className={styles.retryButton}
                  onClick={resetFilters}
                >
                  Сбросить фильтры
                </button>
                <Link href="/chat" className={styles.chatLink}>
                  <MessageSquareText size={15} />
                  Спросить бота
                </Link>
              </div>
            </div>
          )}

          {!showSkeleton && !showLoadError && lessons.length > 0 && (
            <>
              <ScheduleTable lessons={lessons} />
              <ScheduleCards lessons={lessons} />
            </>
          )}
        </section>

        <div className={styles.footerNote}>
          <span>
            <Server size={14} />
            Данные загружаются из NestJS API, фильтрация выполняется на сервере.
          </span>
          <span>
            <Database size={14} />
            SQLite + Prisma · готова схема для PostgreSQL
          </span>
          <span className={styles.filterCount}>
            {hasActiveFilters
              ? `Активно фильтров: ${Object.keys(filters).length}`
              : 'Показана полная неделя'}
          </span>
        </div>
      </div>
    </div>
  );
}
