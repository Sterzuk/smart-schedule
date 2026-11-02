'use client';

import { useEffect, useRef, useState } from 'react';
import { ApiError, sendChatMessage } from '@/services/api';
import type { AppliedFilters, Lesson } from '@/types/schedule';

export interface ChatUiMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  lessons?: Lesson[];
  appliedFilters?: AppliedFilters;
  suggestions?: string[];
  isError?: boolean;
}

const WELCOME_MESSAGE: ChatUiMessage = {
  id: 'welcome',
  role: 'bot',
  content:
    'Здравствуйте! Я — бот «Умного расписания». Спросите про уроки обычным языком: по дню, предмету или времени. Например: «Расписание 10-Б на понедельник».',
  suggestions: [
    'Расписание 10-Б на понедельник',
    'Какие уроки после 13:00?',
    'Когда математика у 10-Б?',
  ],
};

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatUiMessage[]>([
    WELCOME_MESSAGE,
  ]);
  const [isPending, setIsPending] = useState(false);
  const pendingRef = useRef(false);
  const lastRequestRef = useRef<string | null>(null);
  const activeControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      activeControllerRef.current?.abort();
    };
  }, []);

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || pendingRef.current) {
      return;
    }

    const userMessage: ChatUiMessage = {
      id: createId(),
      role: 'user',
      content: message,
    };

    setMessages((current) => [...current, userMessage]);
    pendingRef.current = true;
    setIsPending(true);
    lastRequestRef.current = message;

    const controller = new AbortController();
    activeControllerRef.current = controller;

    try {
      const response = await sendChatMessage(message, controller.signal);
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: 'bot',
          content: response.reply,
          lessons: response.lessons,
          appliedFilters: response.appliedFilters,
          suggestions: response.suggestions,
        },
      ]);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      const content =
        error instanceof ApiError
          ? error.message
          : 'Не удалось получить ответ от бота. Проверьте соединение и попробуйте ещё раз.';

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: 'bot',
          content,
          isError: true,
          suggestions: lastRequestRef.current
            ? [lastRequestRef.current]
            : undefined,
        },
      ]);
    } finally {
      pendingRef.current = false;
      setIsPending(false);
      activeControllerRef.current = null;
    }
  };

  return {
    messages,
    isPending,
    sendMessage,
  };
}
