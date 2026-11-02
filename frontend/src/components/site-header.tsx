'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './site-header.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'Главная' },
  { href: '/chat', label: 'Чат-бот' },
  { href: '/schedule', label: 'Расписание' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Умное расписание — на главную">
          <span className={styles.logoMark}>
            <CalendarDays size={22} strokeWidth={2.2} />
            <span className={styles.logoSpark} />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Умное расписание</span>
            <span className={styles.brandCaption}>школа без рутины</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${
                isActive(item.href) ? styles.navLinkActive : ''
              }`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.headerAside}>
          <span className={styles.demoBadge}>MVP</span>
          <button
            type="button"
            className={styles.menuButton}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu} id="mobile-navigation">
          <nav className={styles.mobileNav} aria-label="Мобильная навигация">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.mobileLink} ${
                  isActive(item.href) ? styles.mobileLinkActive : ''
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
