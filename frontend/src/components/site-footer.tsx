import Link from 'next/link';
import { CalendarDays, MessageSquareText, Sparkles } from 'lucide-react';
import styles from './site-footer.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandColumn}>
          <Link href="/" className={styles.brand}>
            <span className={styles.logoMark}>
              <CalendarDays size={20} />
            </span>
            <span>Умное расписание</span>
          </Link>
          <p className={styles.description}>
            Простой способ найти нужные уроки: задайте вопрос боту или
            настройте фильтры в расписании.
          </p>
          <div className={styles.stack}>
            <span>Next.js</span>
            <span>NestJS</span>
            <span>Prisma</span>
          </div>
        </div>

        <div className={styles.linksColumn}>
          <span className={styles.columnTitle}>Разделы</span>
          <Link href="/" className={styles.link}>
            Главная
          </Link>
          <Link href="/chat" className={styles.link}>
            <MessageSquareText size={15} />
            Чат-бот
          </Link>
          <Link href="/schedule" className={styles.link}>
            <CalendarDays size={15} />
            Расписание
          </Link>
        </div>

        <div className={styles.tipColumn}>
          <span className={styles.tipIcon}>
            <Sparkles size={18} />
          </span>
          <div>
            <span className={styles.columnTitle}>Попробуйте</span>
            <p className={styles.tip}>
              «Какие уроки у 10-Б начинаются после 13:00?»
            </p>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} Умное расписание</span>
        <span>Учебный MVP · данные демонстрационные</span>
      </div>
    </footer>
  );
}
