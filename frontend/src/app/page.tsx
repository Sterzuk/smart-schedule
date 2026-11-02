import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  Check,
  MessageSquareText,
  Search,
  SlidersHorizontal,
  Sparkles,
  WandSparkles,
  Zap,
} from 'lucide-react';
import { Chat } from '@/components/chat';
import styles from './page.module.css';

const QUERY_EXAMPLES = [
  'Покажи расписание 10-Б на понедельник',
  'Какие уроки начинаются после 13:00?',
  'Когда математика у 10-Б?',
  'Уроки физики в пятницу',
];

const FEATURES = [
  {
    icon: MessageSquareText,
    title: 'Вопросы обычным языком',
    description:
      'Не нужно помнить команды. Бот понимает дни недели, классы, предметы и время начала или окончания уроков.',
    example: '«Что у 10-Б завтра заканчивается после 14:00?»',
  },
  {
    icon: SlidersHorizontal,
    title: 'Фильтры работают вместе',
    description:
      'Комбинируйте класс, день, предмет и время. Вся фильтрация выполняется на backend, поэтому результаты всегда согласованы.',
    example: '10-Б + Среда + начало после 10:00',
  },
  {
    icon: CalendarCheck2,
    title: 'Вся неделя как на ладони',
    description:
      'Переключайтесь между днями или смотрите полное расписание. На телефоне удобные карточки, на компьютере — подробная таблица.',
    example: '10-Б · 5 учебных дней · 20 предметов',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Задайте вопрос',
    text: 'Откройте чат и напишите запрос так, как сказали бы его другу.',
  },
  {
    number: '02',
    title: 'Уточните критерии',
    text: 'Добавьте день, класс или время. А для подробного просмотра используйте фильтры.',
  },
  {
    number: '03',
    title: 'Получите уроки',
    text: 'В ответе будут предмет, класс, время и кабинет.',
  },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBackground} aria-hidden="true">
          <span className={styles.orbOne} />
          <span className={styles.orbTwo} />
          <span className={styles.gridPattern} />
        </div>

        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              <Sparkles size={14} />
              умный поиск по расписанию
            </span>

            <h1 className={styles.heroTitle}>
              Расписание,
              <br />
              которое <span>отвечает</span>
              <br />
              на ваши вопросы
            </h1>

            <p className={styles.heroLead}>
              «Умное расписание» — это чат-бот и удобные фильтры для уроков.
              Найдите нужный класс, предмет или время за несколько секунд —
              без звонков и ручного поиска по таблицам.
            </p>

            <div className={styles.heroActions}>
              <Link href="/chat" className={styles.primaryButton}>
                Открыть чат-бота
                <ArrowRight size={18} />
              </Link>
              <Link href="/schedule" className={styles.secondaryButton}>
                <CalendarDays size={18} />
                Смотреть расписание
              </Link>
            </div>

            <div className={styles.heroFacts}>
              <span>
                <Check size={14} />
                Без регистрации
              </span>
              <span>
                <Check size={14} />
                Единая база данных
              </span>
              <span>
                <Check size={14} />
                На телефоне и компьютере
              </span>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.chatScene}>
              <div className={styles.sceneBadge}>
                <span className={styles.sceneBadgeIcon}>
                  <WandSparkles size={16} />
                </span>
                <div>
                  <strong>Понимает с первого раза</strong>
                  <span>дни · классы · предметы · время</span>
                </div>
              </div>

              <div className={styles.chatShell}>
                <Chat variant="compact" />
              </div>

              <div className={styles.sceneNote}>
                <span className={styles.sceneNoteDot} />
                Работает на демонстрационном расписании школы
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Возможности</span>
            <h2 className={styles.sectionTitle}>
              Меньше поиска. Больше времени на уроки.
            </h2>
            <p className={styles.sectionLead}>
              Один сервис закрывает два сценария: быстрый вопрос боту и
              подробный просмотр расписания с фильтрами.
            </p>
          </div>

          <div className={styles.featureGrid}>
            {FEATURES.map(({ icon: Icon, title, description, example }) => (
              <article key={title} className={styles.featureCard}>
                <span className={styles.featureIcon}>
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className={styles.featureExample}>{example}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.howSection}>
        <div className="container">
          <div className={styles.howPanel}>
            <div className={styles.howIntro}>
              <span className={styles.sectionEyebrow}>Как это работает</span>
              <h2>Три шага до нужного урока</h2>
              <p>
                Начните с вопроса в чате. Если хочется увидеть всю картину,
                переходите в расписание и настраивайте фильтры.
              </p>

              <div className={styles.howSteps}>
                {STEPS.map((step) => (
                  <div key={step.number} className={styles.step}>
                    <span className={styles.stepNumber}>{step.number}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.examplesPanel}>
              <div className={styles.examplesHeader}>
                <span className={styles.examplesIcon}>
                  <Zap size={18} />
                </span>
                <div>
                  <h3>Попробуйте спросить</h3>
                  <p>Бот поймёт любой из этих запросов</p>
                </div>
              </div>

              <div className={styles.queryList}>
                {QUERY_EXAMPLES.map((query) => (
                  <div key={query} className={styles.query}>
                    <Search size={16} />
                    <span>{query}</span>
                  </div>
                ))}
              </div>

              <div className={styles.examplesFooter}>
                <span>
                  Не нашли нужный срез? В расписании доступны фильтры по
                  классу, дню, предмету и времени.
                </span>
                <Link href="/schedule" className={styles.examplesLink}>
                  Перейти к фильтрам
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaPanel}>
            <div className={styles.ctaDecor} aria-hidden="true">
              <span />
              <span />
            </div>
            <div className={styles.ctaContent}>
              <span className={styles.ctaEyebrow}>
                <Sparkles size={14} />
                готово к использованию
              </span>
              <h2>Найдите следующий урок за один вопрос</h2>
              <p>
                Спросите про день, класс, предмет или время — бот соберёт
                подходящие уроки в понятный список.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/chat" className={styles.ctaPrimary}>
                Задать вопрос
                <ArrowRight size={17} />
              </Link>
              <Link href="/schedule" className={styles.ctaSecondary}>
                Открыть расписание
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
