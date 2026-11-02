import type { Metadata } from 'next';
import { ScheduleExplorer } from '@/components/schedule/schedule-explorer';

export const metadata: Metadata = {
  title: 'Расписание',
  description:
    'Расписание 10-Б с фильтрами по дню недели, предмету и времени начала.',
};

export default function SchedulePage() {
  return <ScheduleExplorer />;
}
