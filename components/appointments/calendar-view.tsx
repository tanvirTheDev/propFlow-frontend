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
import { ChevronLeft, ChevronRight, CalendarDays, Home, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Appointment, LandlordVisit } from '@/lib/api/types';

const APPT_STYLE: Record<string, string> = {
  URGENT: 'bg-linear-to-r from-red-500 to-rose-500 text-white border-red-400',
  NORMAL: 'bg-linear-to-r from-blue-500 to-indigo-500 text-white border-blue-400',
  LOW:    'bg-linear-to-r from-gray-400 to-gray-500 text-white border-gray-400',
};

interface Props {
  appointments: Appointment[];
  visits?: LandlordVisit[];
  onVisitClick?: (visit: LandlordVisit) => void;
}

type ViewMode = 'week' | 'month';

const DAY_NAMES_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_NAMES_DE = ['Mo',  'Di',  'Mi',  'Do',  'Fr',  'Sa',  'So'];

export function CalendarView({ appointments, visits = [], onVisitClick }: Props) {
  const t = useTranslations('calendar');
  const locale = useLocale();
  const dateLocale = locale === 'de' ? de : enUS;
  const router = useRouter();

  const [current, setCurrent] = useState(new Date());
  const [view, setView] = useState<ViewMode>('month');

  const weekStart  = startOfWeek(current, { weekStartsOn: 1 });
  const weekEnd    = endOfWeek(current, { weekStartsOn: 1 });
  const monthStart = startOfMonth(current);
  const monthEnd   = endOfMonth(current);

  const days = view === 'week'
    ? eachDayOfInterval({ start: weekStart, end: weekEnd })
    : eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppts  = (day: Date) => appointments.filter((a) => isSameDay(new Date(a.scheduledAt), day));
  const getVisits = (day: Date) => visits.filter((v) => isSameDay(new Date(v.scheduledAt), day));

  const navigatePrev = () => view === 'week' ? setCurrent(subWeeks(current, 1)) : setCurrent(subMonths(current, 1));
  const navigateNext = () => view === 'week' ? setCurrent(addWeeks(current, 1)) : setCurrent(addMonths(current, 1));

  const headerLabel = view === 'week'
    ? `${format(weekStart, 'd MMM', { locale: dateLocale })} – ${format(weekEnd, 'd MMM yyyy', { locale: dateLocale })}`
    : format(current, 'MMMM yyyy', { locale: dateLocale });

  const dayNames = locale === 'de' ? DAY_NAMES_DE : DAY_NAMES_EN;
  const leadingBlanks = view === 'month' ? (monthStart.getDay() + 6) % 7 : 0;
  const maxSlots = view === 'month' ? 2 : 5;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-white">
        {/* Nav arrows + label */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={navigatePrev}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-48 text-center text-sm font-bold">{headerLabel}</span>
          <button
            onClick={navigateNext}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Right: Today + view toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrent(new Date())}
            className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm hover:bg-white/25 transition-colors"
          >
            {t('today')}
          </button>

          {/* Segmented toggle */}
          <div className="flex rounded-xl bg-white/15 p-0.5 backdrop-blur-sm">
            {(['week', 'month'] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  view === v
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {t(v)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Day-name headers ───────────────────────────────── */}
      <div className="grid grid-cols-7 border-b border-border/50 bg-muted/30">
        {dayNames.map((d) => (
          <div key={d} className="py-2 text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* ── Day grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-7 divide-x divide-y divide-border/40">
        {/* Leading blanks for month view */}
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} className="min-h-24 bg-muted/20 p-2" />
        ))}

        {days.map((day) => {
          const dayAppts   = getAppts(day);
          const dayVisits  = getVisits(day);
          const inMonth    = view === 'month' ? isSameMonth(day, current) : true;
          const today      = isToday(day);
          const allItems   = [
            ...dayAppts.map((a)  => ({ type: 'appt'  as const, item: a })),
            ...dayVisits.map((v) => ({ type: 'visit' as const, item: v })),
          ];
          const overflow   = Math.max(0, allItems.length - maxSlots);

          return (
            <div
              key={day.toISOString()}
              className={`group min-h-24 p-2 transition-colors hover:bg-indigo-50/30 ${
                !inMonth ? 'bg-muted/20' : 'bg-white'
              }`}
            >
              {/* Day number */}
              <div className="mb-1.5 flex justify-end">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    today
                      ? 'bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-300/50 ring-2 ring-indigo-300/40'
                      : !inMonth
                      ? 'text-muted-foreground/40'
                      : 'text-foreground/70 group-hover:text-indigo-600'
                  }`}
                >
                  {format(day, 'd')}
                </span>
              </div>

              {/* Events */}
              <div className="space-y-0.5">
                {allItems.slice(0, maxSlots).map((entry) => {
                  if (entry.type === 'appt') {
                    const appt = entry.item as Appointment;
                    return (
                      <button
                        key={`a-${appt.id}`}
                        onClick={() => router.push(`/landlord/tickets/${appt.ticketId}`)}
                        className={`group/pill w-full truncate rounded-md px-1.5 py-0.5 text-left text-[10px] font-semibold leading-tight shadow-sm hover:opacity-80 transition-opacity flex items-center gap-1 ${APPT_STYLE[appt.ticket.priority] ?? APPT_STYLE.NORMAL}`}
                        title={appt.ticket.title}
                      >
                        <AlertCircle className="h-2.5 w-2.5 shrink-0 opacity-80" />
                        <span className="truncate">{format(new Date(appt.scheduledAt), 'HH:mm')} {appt.ticket.title}</span>
                      </button>
                    );
                  }

                  const visit = entry.item as LandlordVisit;
                  return (
                    <button
                      key={`v-${visit.id}`}
                      onClick={() => onVisitClick?.(visit)}
                      className="w-full truncate rounded-md bg-linear-to-r from-purple-500 to-fuchsia-500 px-1.5 py-0.5 text-left text-[10px] font-semibold leading-tight text-white shadow-sm hover:opacity-80 transition-opacity flex items-center gap-1"
                      title={visit.property.name}
                    >
                      <Home className="h-2.5 w-2.5 shrink-0 opacity-80" />
                      <span className="truncate">{format(new Date(visit.scheduledAt), 'HH:mm')} {visit.property.name}</span>
                    </button>
                  );
                })}

                {overflow > 0 && (
                  <p className="px-1 text-[10px] font-semibold text-indigo-500">
                    +{overflow} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Legend ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 border-t border-border/50 bg-muted/20 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-linear-to-r from-red-500 to-rose-500" />
          <span className="text-[11px] font-medium text-muted-foreground">Urgent ticket</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-linear-to-r from-blue-500 to-indigo-500" />
          <span className="text-[11px] font-medium text-muted-foreground">Normal ticket</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-linear-to-r from-purple-500 to-fuchsia-500" />
          <span className="text-[11px] font-medium text-muted-foreground">Property visit</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white">
            {format(new Date(), 'd')}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">Today</span>
        </div>
      </div>
    </div>
  );
}
