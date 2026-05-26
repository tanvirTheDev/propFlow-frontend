'use client';

import { useTranslations, useLocale } from 'next-intl';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import {
  CalendarDays, Clock, MapPin, Home, AlertTriangle,
  CheckCircle2, XCircle, Sparkles, ChevronRight,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useVisits } from '@/lib/hooks/use-visits';
import { useGsapReveal } from '@/lib/hooks/use-gsap-reveal';
import type { LandlordVisit } from '@/lib/api/types';

/* ── countdown label ──────────────────────────────────── */
function countdownLabel(scheduledAt: string): { label: string; urgent: boolean } {
  const d = new Date(scheduledAt);
  if (isToday(d))     return { label: 'Today',    urgent: true };
  if (isTomorrow(d))  return { label: 'Tomorrow', urgent: true };
  const days = differenceInDays(d, new Date());
  if (days <= 3)      return { label: `In ${days} days`, urgent: true };
  return { label: `In ${days} days`, urgent: false };
}

/* ── reason icon ──────────────────────────────────────── */
const REASON_ICONS: Record<string, string> = {
  INSPECTION:   '🔍',
  MAINTENANCE:  '🔧',
  REPAIR:       '🛠️',
  EMERGENCY:    '🚨',
  SHOWING:      '👀',
  OTHER:        '📋',
};

/* ── visit card ───────────────────────────────────────── */
function VisitItem({ visit, locale }: { visit: LandlordVisit; locale: string }) {
  const t = useTranslations('visits');
  const dateLocale = locale === 'de' ? de : enUS;
  const scheduled = new Date(visit.scheduledAt);
  const endTime = new Date(scheduled.getTime() + visit.durationMin * 60_000);
  const countdown = countdownLabel(visit.scheduledAt);
  const myUnit = visit.units[0];
  const unitLabel = myUnit?.unit?.unitNumber ? `Unit ${myUnit.unit.unitNumber}` : '';

  return (
    <div className="card-hover group overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
      {/* Top colour band */}
      <div className="h-1.5 w-full bg-linear-to-r from-violet-500 to-fuchsia-500" />

      <div className="p-4">
        {/* Row 1: property + countdown badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-100 to-fuchsia-100 text-lg">
              {REASON_ICONS[visit.reason] ?? '📋'}
            </div>
            <div className="min-w-0">
              <p className="font-bold truncate">{visit.property.name}</p>
              {unitLabel && (
                <p className="text-xs text-muted-foreground">{unitLabel}</p>
              )}
            </div>
          </div>

          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            countdown.urgent
              ? 'bg-orange-100 text-orange-700'
              : 'bg-indigo-50 text-indigo-600'
          }`}>
            {countdown.label}
          </span>
        </div>

        {/* Row 2: details */}
        <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-violet-400" />
            {format(scheduled, 'EEEE, dd MMMM yyyy', { locale: dateLocale })}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0 text-violet-400" />
            {format(scheduled, 'HH:mm')} – {format(endTime, 'HH:mm')}
            <span className="text-muted-foreground/60">({visit.durationMin} min)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-400" />
            <span className="truncate">{visit.property.street}, {visit.property.city}</span>
          </div>
        </div>

        {/* Reason */}
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {t(`reasons.${visit.reason}`)}
          </span>
        </div>

        {/* Access notice */}
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200/80 p-2.5">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
          <p className="text-xs text-amber-800 leading-relaxed">{t('tenant.accessNote')}</p>
        </div>
      </div>
    </div>
  );
}

/* ── past visit row ───────────────────────────────────── */
function PastVisitItem({ visit, locale }: { visit: LandlordVisit; locale: string }) {
  const t = useTranslations('visits');
  const dateLocale = locale === 'de' ? de : enUS;
  const scheduled = new Date(visit.scheduledAt);
  const cancelled = visit.status === 'CANCELLED';

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-white p-3 opacity-60 hover:opacity-80 transition-opacity">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
        cancelled ? 'bg-gray-100' : 'bg-emerald-100'
      }`}>
        {cancelled
          ? <XCircle className="h-4 w-4 text-gray-400" />
          : <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{visit.property.name}</p>
        <p className="text-xs text-muted-foreground">
          {format(scheduled, 'dd MMM yyyy · HH:mm', { locale: dateLocale })}
        </p>
      </div>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
        cancelled
          ? 'bg-gray-100 text-gray-500'
          : 'bg-emerald-100 text-emerald-700'
      }`}>
        {cancelled ? 'Cancelled' : 'Completed'}
      </span>
    </div>
  );
}

/* ── skeleton ─────────────────────────────────────────── */
function CalendarSkeleton() {
  return (
    <div className="space-y-5 pb-4">
      <Skeleton className="h-10 w-48 rounded-xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
      {[1,2].map(i => <Skeleton key={i} className="h-44 rounded-2xl" />)}
    </div>
  );
}

/* ── page ─────────────────────────────────────────────── */
export default function TenantCalendarPage() {
  const t = useTranslations('visits');
  const tCalendar = useTranslations('calendar');
  const locale = useLocale();

  const { data: visits = [], isLoading } = useVisits();
  const pageRef = useGsapReveal<HTMLDivElement>({ stagger: 0.08, fromY: 22 });

  if (isLoading) return <CalendarSkeleton />;

  const upcoming = visits.filter(v => v.status === 'SCHEDULED');
  const past     = visits.filter(v => v.status !== 'SCHEDULED');

  return (
    <div ref={pageRef} className="space-y-5 pb-4">

      {/* ── Hero header ──────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-600 via-purple-600 to-fuchsia-600 px-5 py-4 text-white shadow-lg shadow-purple-500/20">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 left-4 h-28 w-28 rounded-full bg-fuchsia-400/20 blur-xl float" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-purple-200">
              <CalendarDays className="h-3.5 w-3.5" /> {tCalendar('title')}
            </div>
            <p className="text-2xl font-black tracking-tight">My Schedule</p>
            <p className="mt-0.5 text-sm text-purple-200">
              {upcoming.length} upcoming · {past.length} past
            </p>
          </div>
          <div className="shrink-0 rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
            <CalendarDays className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-hover rounded-2xl bg-linear-to-br from-violet-500 to-purple-700 p-4 text-white shadow-md shadow-purple-200">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">Upcoming</p>
          <p className="mt-1 text-4xl font-black">{upcoming.length}</p>
          <p className="mt-0.5 text-xs text-white/70">scheduled visits</p>
        </div>
        <div className="card-hover rounded-2xl bg-linear-to-br from-emerald-400 to-green-600 p-4 text-white shadow-md shadow-emerald-200">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">Completed</p>
          <p className="mt-1 text-4xl font-black">{past.filter(v => v.status === 'COMPLETED').length}</p>
          <p className="mt-0.5 text-xs text-white/70">past visits</p>
        </div>
      </div>

      {/* ── Empty state ───────────────────────────────────── */}
      {upcoming.length === 0 && past.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-white py-14 text-center">
          <Sparkles className="h-10 w-10 text-violet-300" />
          <p className="font-semibold text-muted-foreground">{t('empty')}</p>
          <p className="text-sm text-muted-foreground/70">Your landlord hasn't scheduled any visits yet.</p>
        </div>
      )}

      {/* ── Upcoming visits ───────────────────────────────── */}
      {upcoming.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 text-violet-500" />
              {t('upcomingTitle')}
            </p>
            <div className="h-px flex-1 bg-border" />
          </div>
          {upcoming.map(v => (
            <VisitItem key={v.id} visit={v} locale={locale} />
          ))}
        </section>
      )}

      {/* ── Past visits ───────────────────────────────────── */}
      {past.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Past Visits</p>
            <div className="h-px flex-1 bg-border" />
          </div>
          {past.map(v => (
            <PastVisitItem key={v.id} visit={v} locale={locale} />
          ))}
        </section>
      )}
    </div>
  );
}
