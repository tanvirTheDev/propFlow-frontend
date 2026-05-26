'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { format, isToday, isTomorrow } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import {
  Plus, CalendarDays, Clock, MapPin, Ticket,
  Home, CheckCircle2, XCircle, Sparkles, ChevronRight,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarView } from '@/components/appointments/calendar-view';
import { VisitForm } from '@/components/visits/visit-form';
import { VisitDetailSheet } from '@/components/visits/visit-detail-sheet';
import { useAppointments } from '@/lib/hooks/use-appointments';
import { useVisits } from '@/lib/hooks/use-visits';
import { useGsapReveal } from '@/lib/hooks/use-gsap-reveal';
import type { LandlordVisit } from '@/lib/api/types';

const PRIORITY_GRADIENT: Record<string, string> = {
  URGENT: 'from-red-500 to-rose-500',
  NORMAL: 'from-blue-500 to-indigo-500',
  LOW:    'from-gray-400 to-gray-500',
};

const PRIORITY_BADGE: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700 border-red-200',
  NORMAL: 'bg-blue-100 text-blue-700 border-blue-200',
  LOW:    'bg-gray-100 text-gray-600 border-gray-200',
};

function dayLabel(date: Date, todayStr: string, tomorrowStr: string): string {
  if (isToday(date))    return todayStr;
  if (isTomorrow(date)) return tomorrowStr;
  return format(date, 'EEE, dd MMM');
}

function CalendarSkeleton() {
  return (
    <div className="flex flex-col gap-5 md:flex-row">
      <div className="flex-1 space-y-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-120 rounded-2xl" />
      </div>
      <div className="md:w-72 space-y-3">
        <Skeleton className="h-8 w-32 rounded-xl" />
        {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
      </div>
    </div>
  );
}

export default function LandlordCalendarPage() {
  const t = useTranslations('calendar');
  const tVisits = useTranslations('visits');
  const locale = useLocale();
  const dateLocale = locale === 'de' ? de : enUS;

  const { data: appointments = [], isLoading: loadingAppts } = useAppointments();
  const { data: visits = [], isLoading: loadingVisits } = useVisits();

  const [visitFormOpen, setVisitFormOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<LandlordVisit | null>(null);

  const pageRef  = useGsapReveal<HTMLDivElement>({ stagger: 0.08, fromY: 20 });

  const isLoading = loadingAppts || loadingVisits;
  if (isLoading) return <CalendarSkeleton />;

  const todayStr    = t('today');
  const tomorrowStr = t('tomorrow');

  /* combine & sort upcoming appts + visits for the side panel */
  const upcomingAppts = appointments
    .filter(a => a.status === 'SCHEDULED' && new Date(a.scheduledAt) >= new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 8);

  const upcomingVisits = visits
    .filter(v => v.status === 'SCHEDULED' && new Date(v.scheduledAt) >= new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5);

  const totalUpcoming = upcomingAppts.length + upcomingVisits.length;

  return (
    <div ref={pageRef} className="space-y-5 pb-4">

      {/* ── Page title row ──────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('title')}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {totalUpcoming} upcoming event{totalUpcoming !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => setVisitFormOpen(true)}
          className="gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 font-semibold shadow-md shadow-indigo-300/40 hover:opacity-90 hover:scale-105 transition-all"
        >
          <Plus className="h-4 w-4" />
          {tVisits('schedule')}
        </Button>
      </div>

      {/* ── Main layout ─────────────────────────────────────── */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">

        {/* Calendar grid */}
        <div className="flex-1 min-w-0">
          <CalendarView
            appointments={appointments}
            visits={visits}
            onVisitClick={(v) => setSelectedVisit(v)}
          />
        </div>

        {/* ── Side panel ──────────────────────────────────────── */}
        <aside className="xl:w-72 xl:shrink-0 space-y-4">

          {/* Upcoming appointments */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-border/50 bg-linear-to-r from-blue-50 to-indigo-50 px-4 py-3">
              <div className="rounded-lg bg-blue-100 p-1.5">
                <Ticket className="h-4 w-4 text-blue-600" />
              </div>
              <p className="font-bold text-sm">Upcoming Tickets</p>
              {upcomingAppts.length > 0 && (
                <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                  {upcomingAppts.length}
                </span>
              )}
            </div>

            {upcomingAppts.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                <p className="text-sm text-muted-foreground">All clear!</p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {upcomingAppts.map((appt) => {
                  const dt = new Date(appt.scheduledAt);
                  const grad = PRIORITY_GRADIENT[appt.ticket.priority] ?? PRIORITY_GRADIENT.NORMAL;
                  const badge = PRIORITY_BADGE[appt.ticket.priority] ?? PRIORITY_BADGE.NORMAL;
                  return (
                    <div key={appt.id} className="group flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      {/* Color bar */}
                      <div className={`mt-0.5 h-full w-1 shrink-0 rounded-full bg-linear-to-b ${grad}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{appt.ticket.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {dayLabel(dt, todayStr, tomorrowStr)} · {format(dt, 'HH:mm')}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className={`shrink-0 text-[10px] font-semibold ${badge}`}>
                        {appt.ticket.priority}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming visits */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-border/50 bg-linear-to-r from-purple-50 to-fuchsia-50 px-4 py-3">
              <div className="rounded-lg bg-purple-100 p-1.5">
                <Home className="h-4 w-4 text-purple-600" />
              </div>
              <p className="font-bold text-sm">Scheduled Visits</p>
              {upcomingVisits.length > 0 && (
                <span className="ml-auto rounded-full bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">
                  {upcomingVisits.length}
                </span>
              )}
            </div>

            {upcomingVisits.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Sparkles className="h-8 w-8 text-purple-300" />
                <p className="text-sm text-muted-foreground">No visits scheduled</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-1 gap-1.5 rounded-xl text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
                  onClick={() => setVisitFormOpen(true)}
                >
                  <Plus className="h-3 w-3" /> Schedule one
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {upcomingVisits.map((visit) => {
                  const dt = new Date(visit.scheduledAt);
                  return (
                    <button
                      key={visit.id}
                      onClick={() => setSelectedVisit(visit)}
                      className="group w-full flex items-start gap-3 px-4 py-3 hover:bg-purple-50/50 transition-colors text-left"
                    >
                      <div className="mt-0.5 h-full w-1 shrink-0 rounded-full bg-linear-to-b from-purple-500 to-fuchsia-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{visit.property.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {dayLabel(dt, todayStr, tomorrowStr)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(dt, 'HH:mm')} · {visit.durationMin}min
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{visit.property.street}, {visit.property.city}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all mt-1" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick schedule CTA */}
          <button
            onClick={() => setVisitFormOpen(true)}
            className="card-hover w-full flex items-center gap-3 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 p-4 text-white shadow-lg shadow-indigo-300/30"
          >
            <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
              <Plus className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Schedule a Visit</p>
              <p className="text-xs text-indigo-200">Notify tenants automatically</p>
            </div>
            <ChevronRight className="ml-auto h-5 w-5 text-white/60" />
          </button>
        </aside>
      </div>

      {/* Modals */}
      <VisitForm open={visitFormOpen} onClose={() => setVisitFormOpen(false)} />
      <VisitDetailSheet
        key={selectedVisit?.id ?? 'none'}
        visit={selectedVisit}
        open={Boolean(selectedVisit)}
        isLandlord={true}
        onClose={() => setSelectedVisit(null)}
      />
    </div>
  );
}
