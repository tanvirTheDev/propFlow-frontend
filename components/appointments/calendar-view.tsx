'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  format,
  startOfWeek, endOfWeek,
  startOfMonth, endOfMonth,
  eachDayOfInterval,
  addWeeks, subWeeks,
  addMonths, subMonths,
  isSameDay, isToday,
  isSameMonth,
} from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Appointment, LandlordVisit } from '@/lib/api/types';

const PRIORITY_COLOR: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700 border-red-200',
  NORMAL: 'bg-blue-100 text-blue-700 border-blue-200',
  LOW: 'bg-gray-100 text-gray-600 border-gray-200',
};

interface Props {
  appointments: Appointment[];
  visits?: LandlordVisit[];
  onVisitClick?: (visit: LandlordVisit) => void;
}

type ViewMode = 'week' | 'month';

export function CalendarView({ appointments, visits = [], onVisitClick }: Props) {
  const t = useTranslations('calendar');
  const locale = useLocale();
  const dateLocale = locale === 'de' ? de : enUS;
  const router = useRouter();

  const [current, setCurrent] = useState(new Date());
  const [view, setView] = useState<ViewMode>('week');

  const weekStart = startOfWeek(current, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(current, { weekStartsOn: 1 });
  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);

  const days = view === 'week'
    ? eachDayOfInterval({ start: weekStart, end: weekEnd })
    : eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppts = (day: Date) =>
    appointments.filter((a) => isSameDay(new Date(a.scheduledAt), day));

  const getVisits = (day: Date) =>
    visits.filter((v) => isSameDay(new Date(v.scheduledAt), day));

  const navigatePrev = () => {
    if (view === 'week') setCurrent(subWeeks(current, 1));
    else setCurrent(subMonths(current, 1));
  };

  const navigateNext = () => {
    if (view === 'week') setCurrent(addWeeks(current, 1));
    else setCurrent(addMonths(current, 1));
  };

  const headerLabel = view === 'week'
    ? `${format(weekStart, 'd MMM', { locale: dateLocale })} – ${format(weekEnd, 'd MMM yyyy', { locale: dateLocale })}`
    : format(current, 'MMMM yyyy', { locale: dateLocale });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={navigatePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-40 text-center text-sm font-semibold">{headerLabel}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrent(new Date())}>{t('today')}</Button>
        </div>
        <div className="flex rounded-lg border p-0.5">
          {(['week', 'month'] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                view === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {t(v)}
            </button>
          ))}
        </div>
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 gap-px">
        {(locale === 'de' ? ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-px bg-border">
        {/* Month view: leading empty cells */}
        {view === 'month' && Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-20 bg-muted/30 p-1" />
        ))}

        {days.map((day) => {
          const dayAppts = getAppts(day);
          const dayVisits = getVisits(day);
          const isCurrentMonth = view === 'month' ? isSameMonth(day, current) : true;
          const maxSlots = view === 'month' ? 2 : 4;
          const allItems = [
            ...dayAppts.map((a) => ({ type: 'appt' as const, item: a })),
            ...dayVisits.map((v) => ({ type: 'visit' as const, item: v })),
          ];
          const overflow = allItems.length - maxSlots;

          return (
            <div
              key={day.toISOString()}
              className={`min-h-20 bg-background p-1.5 ${!isCurrentMonth ? 'opacity-40' : ''}`}
            >
              <div className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                isToday(day) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-0.5">
                {allItems.slice(0, maxSlots).map((entry) => {
                  if (entry.type === 'appt') {
                    const appt = entry.item;
                    return (
                      <button
                        key={`appt-${appt.id}`}
                        onClick={() => router.push(`/landlord/tickets/${appt.ticketId}`)}
                        className={`w-full truncate rounded border px-1 py-0.5 text-left text-[11px] leading-tight ${PRIORITY_COLOR[appt.ticket.priority]} hover:opacity-80`}
                      >
                        {format(new Date(appt.scheduledAt), 'HH:mm')} {appt.ticket.title}
                      </button>
                    );
                  }
                  const visit = entry.item;
                  return (
                    <button
                      key={`visit-${visit.id}`}
                      onClick={() => onVisitClick?.(visit)}
                      className="w-full truncate rounded border border-purple-200 bg-purple-100 px-1 py-0.5 text-left text-[11px] leading-tight text-purple-700 hover:opacity-80"
                    >
                      {format(new Date(visit.scheduledAt), 'HH:mm')} 🏠 {visit.property.name}
                    </button>
                  );
                })}
                {overflow > 0 && (
                  <p className="px-1 text-[10px] text-muted-foreground">+{overflow} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
