'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, getSchedule } from '@/services/api';
import type {
  FilterOptions,
  Lesson,
  ScheduleFilters,
} from '@/types/schedule';

const EMPTY_OPTIONS: FilterOptions = {
  classes: [],
  subjects: [],
  days: [],
  lessonNumbers: [],
};

export function useSchedule() {
  const [filters, setFilters] = useState<ScheduleFilters>({});
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [options, setOptions] = useState<FilterOptions>(EMPTY_OPTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const requestCounter = useRef(0);

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestCounter.current;
    const delay = filters.search ? 350 : 120;

    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getSchedule(filters, controller.signal);
        if (requestId !== requestCounter.current) {
          return;
        }
        setLessons(response.lessons);
        setOptions(response.options);
        setHasLoaded(true);
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === 'AbortError'
        ) {
          return;
        }
        if (requestId !== requestCounter.current) {
          return;
        }
        setError(
          requestError instanceof ApiError
            ? requestError.message
            : 'Не удалось загрузить расписание. Попробуйте ещё раз.',
        );
      } finally {
        if (requestId === requestCounter.current) {
          setIsLoading(false);
        }
      }
    }, delay);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [filterKey, reloadToken]);

  const updateFilter = useCallback(
    <K extends keyof ScheduleFilters>(
      key: K,
      value: ScheduleFilters[K],
    ) => {
      setFilters((current) => {
        const next = { ...current };
        if (value === undefined || value === '') {
          delete next[key];
        } else {
          next[key] = value;
        }
        return next;
      });
    },
    [],
  );

  const setFiltersDirectly = useCallback((next: ScheduleFilters) => {
    setFilters(next);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const retry = useCallback(() => {
    setReloadToken((value) => value + 1);
  }, []);

  return {
    filters,
    lessons,
    options,
    isLoading,
    hasLoaded,
    error,
    updateFilter,
    setFilters: setFiltersDirectly,
    resetFilters,
    retry,
    hasActiveFilters: Object.keys(filters).length > 0,
  };
}
