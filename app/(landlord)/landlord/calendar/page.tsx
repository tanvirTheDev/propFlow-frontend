'use client';

import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarView } from '@/components/appointments/calendar-view';
import { AppointmentList } from '@/components/appointments/appointment-list';
import { useAppointments } from '@/lib/hooks/use-appointments';

export default function LandlordCalendarPage() {
  const t = useTranslations('calendar');
  const { data: appointments = [], isLoading } = useAppointments();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const today = appointments.filter((a) => {
    const d = new Date(a.scheduledAt);
    const now = new Date();
    return d.toDateString() === now.toDateString() && a.status === 'SCHEDULED';
  });

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        <CalendarView appointments={appointments} />
      </div>

      <aside className="md:w-64 md:shrink-0">
        <h2 className="mb-3 text-sm font-semibold">{t('today')}</h2>
        <AppointmentList appointments={today} />
      </aside>
    </div>
  );
}
