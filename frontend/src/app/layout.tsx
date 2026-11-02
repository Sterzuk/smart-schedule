import type { Metadata, Viewport } from 'next';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Умное расписание — чат-бот для фильтрации уроков',
    template: '%s · Умное расписание',
  },
  description:
    'Находите нужные уроки за пару секунд: задайте вопрос чат-боту или отфильтруйте школьное расписание по классу, предмету, дню и времени.',
  applicationName: 'Умное расписание',
  keywords: [
    'расписание уроков',
    'чат-бот',
    'школа',
    'фильтры',
    'умное расписание',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f5f8fd',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
