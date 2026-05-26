'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import {
  Home, Plus, CalendarDays, ChevronRight, Ticket,
  MapPin, Clock, AlertTriangle, ArrowRight, Wrench, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmergencyButton } from '@/components/tickets/emergency-button';
import { TenantVisitCard } from '@/components/visits/tenant-visit-card';
import { AnimatedCounter } from '@/components/animations/animated-counter';
import { useMyUnit } from '@/lib/hooks/use-units';
import { useTickets } from '@/lib/hooks/use-tickets';
import { useUpcomingAppointments } from '@/lib/hooks/use-appointments';
import { useVisits } from '@/lib/hooks/use-visits';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useGsapReveal } from '@/lib/hooks/use-gsap-reveal';

const STATUS_COLOR: Record<string, string> = {
  OPEN:        'bg-orange-100 text-orange-700 border-orange-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-200',
  RESOLVED:    'bg-emerald-100 text-emerald-700 border-emerald-200',
  CLOSED:      'bg-gray-100 text-gray-600 border-gray-200',
};

const STATUS_LABEL: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

function DashboardSkeleton() {
  return (
    <div className="space-y-5 pb-4">
      <Skeleton className="h-44 rounded-3xl" />
      <Skeleton className="h-24 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-14 rounded-2xl" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
      </div>
    </div>
  );
}

export default function TenantDashboardPage() {
  const t = useTranslations('dashboard.tenant');
  const tTickets = useTranslations('tickets');
  const tAppts = useTranslations('appointments');
  const tVisits = useTranslations('visits');
  const locale = useLocale();
  const dateLocale = locale === 'de' ? de : enUS;

  const user = useAuthStore((s) => s.user);
  const { data: unit, isLoading: loadingUnit } = useMyUnit();
  const { data: ticketsData, isLoading: loadingTickets } = useTickets({ limit: 3 });
  const { data: upcoming = [] } = useUpcomingAppointments();
  const { data: visitsData = [] } = useVisits();

  const nextAppt = upcoming[0] ?? null;
  const upcomingVisits = visitsData.filter((v) => v.status === 'SCHEDULED');
  const tickets = ticketsData?.data ?? [];
  const openCount = tickets.filter(tk => tk.status === 'OPEN').length;

  const pageRef = useGsapReveal<HTMLDivElement>({ stagger: 0.07, fromY: 22 });
  const statsRef = useGsapReveal<HTMLDivElement>({ stagger: 0.1, delay: 0.2, fromY: 18 });

  if (loadingUnit) return <DashboardSkeleton />;

  return (
    <div ref={pageRef} className="space-y-5 pb-4">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-purple-500/25">
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-6 h-44 w-44 rounded-full bg-fuchsia-500/25 blur-2xl" />
        <div className="pointer-events-none absolute right-16 bottom-6 h-16 w-16 rounded-full bg-pink-300/20 blur-lg float" />

        <div className="relative">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-yellow-300" />
            Tenant Portal
          </div>
          <p className="text-sm font-medium text-purple-200">Hello there 👋</p>
          <h1 className="mt-0.5 text-3xl font-black tracking-tight">{user?.name ?? 'Tenant'}</h1>
          {unit ? (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-purple-200">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate font-medium">Unit {unit.unitNumber} · {unit.property?.name}</span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-purple-200">No unit assigned yet</p>
          )}
          <div className="mt-5">
            <Button size="sm" variant="outline"
              className="h-9 gap-2 rounded-xl border-white/40 bg-white font-semibold text-purple-700 shadow-lg hover:bg-white/90 hover:scale-105 active:scale-95 transition-all"
              asChild>
              <Link href="/tenant/tickets/new">
                <Plus className="h-4 w-4" /> Submit Ticket
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Unit card ─────────────────────────────────────── */}
      {unit && (
        <Link href="/tenant/my-unit"
          className="card-hover group flex items-center gap-4 rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-100 to-purple-100">
            <Home className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold group-hover:text-primary transition-colors">Unit {unit.unitNumber}</p>
            <p className="text-sm text-muted-foreground truncate">{unit.property?.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {unit.property?.street}, {unit.property?.city}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </Link>
      )}

      {/* ── Next appointment ──────────────────────────────── */}
      {nextAppt && (
        <Link href={`/tenant/tickets/${nextAppt.ticketId}`}
          className="card-hover flex items-start gap-4 rounded-2xl border-2 border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 p-4 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-200">
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              {tAppts('upcomingTitle')}
            </p>
            <p className="mt-0.5 font-bold text-sm truncate text-foreground">{nextAppt.ticket.title}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-blue-700 font-medium">
              <Clock className="h-3 w-3" />
              {format(new Date(nextAppt.scheduledAt), 'EEEE, dd MMM · HH:mm', { locale: dateLocale })}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-blue-400" />
        </Link>
      )}

      {/* ── Upcoming visits ───────────────────────────────── */}
      {upcomingVisits.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-bold">{tVisits('upcomingTitle')}</p>
          {upcomingVisits.map((visit) => (
            <TenantVisitCard key={visit.id} visit={visit} />
          ))}
        </div>
      )}

      {/* ── Stats row ─────────────────────────────────────── */}
      <div ref={statsRef} className="grid grid-cols-2 gap-3">
        <div className="card-hover rounded-2xl bg-linear-to-br from-orange-400 to-red-500 p-4 text-white shadow-md shadow-orange-200">
          <div className="mb-1 flex items-center gap-2">
            <Ticket className="h-4 w-4 text-white/80" />
            <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">Open Tickets</span>
          </div>
          <p className="text-4xl font-black">
            <AnimatedCounter value={openCount} delay={0.4} />
          </p>
          <Link href="/tenant/tickets" className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="card-hover rounded-2xl bg-linear-to-br from-purple-500 to-fuchsia-600 p-4 text-white shadow-md shadow-purple-200">
          <div className="mb-1 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-white/80" />
            <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">Visits</span>
          </div>
          <p className="text-4xl font-black">
            <AnimatedCounter value={upcomingVisits.length} delay={0.5} />
          </p>
          <Link href="/tenant/calendar" className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white transition-colors">
            View calendar <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* ── Submit ticket CTA ─────────────────────────────── */}
      <Button
        className="h-14 w-full rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-base font-bold shadow-lg shadow-purple-300/40 hover:opacity-90 hover:scale-[1.01] transition-all"
        asChild
      >
        <Link href="/tenant/tickets/new">
          <Plus className="mr-2 h-5 w-5" />
          {tTickets('submitTicket')}
        </Link>
      </Button>

      {/* ── Recent tickets ────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-bold text-sm">{tTickets('myTickets')}</p>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-primary" asChild>
            <Link href="/tenant/tickets">View all <ArrowRight className="h-3 w-3" /></Link>
          </Button>
        </div>

        {loadingTickets ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
            <Wrench className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{tTickets('noTickets')}</p>
            <Button size="sm" className="mt-3 rounded-xl" asChild>
              <Link href="/tenant/tickets/new">Report an issue</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm divide-y divide-border/50">
            {tickets.map((ticket) => (
              <Link key={ticket.id} href={`/tenant/tickets/${ticket.id}`}
                className="group flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(ticket.createdAt), 'dd MMM yyyy')}
                  </p>
                </div>
                <Badge className={`shrink-0 border text-[10px] font-semibold ${STATUS_COLOR[ticket.status] ?? ''}`} variant="outline">
                  {STATUS_LABEL[ticket.status] ?? ticket.status}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Emergency button ──────────────────────────────── */}
      <EmergencyButton />
    </div>
  );
}
