'use client';

import {
  Bot,
  CornerDownLeft,
  LoaderCircle,
  RotateCcw,
  SendHorizontal,
  Sparkles,
} from 'lucide-react';
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useChat, type ChatUiMessage } from '@/hooks/useChat';
import { LessonResults } from './lesson-results';
import styles from './chat.module.css';

interface ChatProps {
  variant?: 'compact' | 'page';
}

function MessageBubble({
  message,
  suggestions,
  onSuggestion,
  disabled,
}: {
  message: ChatUiMessage;
  suggestions?: string[];
  onSuggestion: (suggestion: string) => void;
  disabled: boolean;
}) {
  const isBot = message.role === 'bot';
  const hasLessons = Boolean(message.lessons?.length);

  return (
    <div
      className={`${styles.messageRow} ${
        isBot ? styles.messageBot : styles.messageUser
      }`}
    >
      {isBot && (
        <span className={styles.botAvatar} aria-hidden="true">
          <Bot size={16} />
        </span>
      )}

      <div
        className={`${styles.bubble} ${
          isBot ? styles.bubbleBot : styles.bubbleUser
        } ${hasLessons ? styles.bubbleWide : ''} ${
          message.isError ? styles.bubbleError : ''
        }`}
      >
        <p className={styles.messageText}>{message.content}</p>

        {message.isError && (
          <span className={styles.errorLabel}>
            <RotateCcw size={12} />
            можно повторить запрос
          </span>
        )}

        {hasLessons && <LessonResults lessons={message.lessons ?? []} />}

        {suggestions && suggestions.length > 0 && (
          <div className={styles.suggestions}>
            {suggestions.slice(0, 3).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className={styles.suggestion}
                onClick={() => onSuggestion(suggestion)}
                disabled={disabled}
              >
                {message.isError && <RotateCcw size={12} />}
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Chat({ variant = 'page' }: ChatProps) {
  const { messages, isPending, sendMessage } = useChat();
  const [value, setValue] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const container = messagesRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isPending]);

  const lastBotId = [...messages]
    .reverse()
    .find((message) => message.role === 'bot')?.id;

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isPending) {
      return;
    }
    setValue('');
    void sendMessage(trimmed);
  };

  const sendSuggestion = (suggestion: string) => {
    if (isPending) {
      return;
    }
    void sendMessage(suggestion);
    textareaRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <section
      className={`${styles.chat} ${
        variant === 'compact' ? styles.chatCompact : styles.chatPage
      }`}
      aria-label="Чат-бот по расписанию"
    >
      <header className={styles.chatHeader}>
        <div className={styles.headerIdentity}>
          <span className={styles.headerIcon}>
            <Sparkles size={20} />
          </span>
          <div>
            <div className={styles.titleRow}>
              <h2 className={styles.title}>Ассистент расписания</h2>
              <span className={styles.versionBadge}>бот</span>
            </div>
            <p className={styles.subtitle}>
              Задайте вопрос о любом уроке
            </p>
          </div>
        </div>
        <span className={styles.demoStatus}>
          <span className={styles.statusDot} />
          демо
        </span>
      </header>

      <div
        className={styles.messages}
        ref={messagesRef}
        role="log"
        aria-live="polite"
        aria-label="История сообщений"
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            suggestions={
              !isPending && message.id === lastBotId
                ? message.suggestions
                : undefined
            }
            onSuggestion={sendSuggestion}
            disabled={isPending}
          />
        ))}

        {isPending && (
          <div className={`${styles.messageRow} ${styles.messageBot}`}>
            <span className={styles.botAvatar} aria-hidden="true">
              <Bot size={16} />
            </span>
            <div className={`${styles.bubble} ${styles.bubbleBot}`}>
              <div className={styles.typing} aria-label="Бот обрабатывает запрос">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.composerArea}>
        <form className={styles.composer} onSubmit={submit} ref={formRef}>
          <label htmlFor={`chat-message-${variant}`} className="sr-only">
            Сообщение для чат-бота
          </label>
          <textarea
            ref={textareaRef}
            id={`chat-message-${variant}`}
            className={styles.textarea}
            placeholder="Например: какие уроки у 10-Б после 13:00?"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            maxLength={500}
            disabled={isPending}
          />
          <button
            className={styles.sendButton}
            type="submit"
            aria-label="Отправить сообщение"
            disabled={!value.trim() || isPending}
          >
            {isPending ? (
              <LoaderCircle size={19} className={styles.spinner} />
            ) : (
              <SendHorizontal size={19} />
            )}
          </button>
        </form>

        <div className={styles.composerHint}>
          <span>
            <CornerDownLeft size={12} />
            Enter — отправить, Shift + Enter — новая строка
          </span>
          <span>{value.length}/500</span>
        </div>
      </div>
    </section>
  );
}
