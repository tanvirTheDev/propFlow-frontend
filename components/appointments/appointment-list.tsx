'use client';

import { useTranslations, useLocale } from 'next-intl';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { AppointmentStatusBadge } from './appointment-status-badge';
import type { Appointment } from '@/lib/api/types';

interface Props {
  appointments: Appointment[];
  basePath?: string;
}

function groupByDay(appointments: Appointment[]): { label: string; items: Appointment[] }[] {
  const groups = new Map<string, Appointment[]>();
  for (const appt of appointments) {
    const d = new Date(appt.scheduledAt);
    let key: string;
    if (isToday(d)) key = '__today__';
    else if (isTomorrow(d)) key = '__tomorrow__';
    else if (isThisWeek(d)) key = format(d, 'EEEE');
    else key = format(d, 'dd MMM yyyy');
    const existing = groups.get(key) ?? [];
    groups.set(key, [...existing, appt]);
  }
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

export function AppointmentList({ appointments, basePath = '/landlord/tickets' }: Props) {
  const t = useTranslations('appointments');
  const tCal = useTranslations('calendar');
  const locale = useLocale();
  const dateLocale = locale === 'de' ? de : enUS;

  if (!appointments.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
        <Calendar className="h-8 w-8" />
        <p className="text-sm">{t('empty')}</p>
      </div>
    );
  }

  const groups = groupByDay(appointments);
  const todayLabel = tCal('today');
  const tomorrowLabel = tCal('tomorrow');

  return (
    <div className="space-y-4">
      {groups.map(({ label, items }) => (
        <div key={label}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label === '__today__' ? todayLabel : label === '__tomorrow__' ? tomorrowLabel : label}
          </p>
          <div className="space-y-2">
            {items.map((appt) => (
              <Link key={appt.id} href={`${basePath}/${appt.ticketId}`} className="block">
                <div className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{appt.ticket.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(appt.scheduledAt), 'HH:mm', { locale: dateLocale })} · {appt.durationMin} min
                    </p>
                  </div>
                  <AppointmentStatusBadge status={appt.status} label={t(`status.${appt.status}`)} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
