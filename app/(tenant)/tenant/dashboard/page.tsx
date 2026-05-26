'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import {
  Home, Plus, CalendarDays, ChevronRight, Ticket,
  MapPin, Clock, AlertTriangle, ArrowRight, Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmergencyButton } from '@/components/tickets/emergency-button';
import { TenantVisitCard } from '@/components/visits/tenant-visit-card';
import { useMyUnit } from '@/lib/hooks/use-units';
import { useTickets } from '@/lib/hooks/use-tickets';
import { useUpcomingAppointments } from '@/lib/hooks/use-appointments';
import { useVisits } from '@/lib/hooks/use-visits';
import { useAuthStore } from '@/lib/stores/auth.store';

const STATUS_COLOR: Record<string, string> = {
  OPEN:        'bg-orange-100 text-orange-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  RESOLVED:    'bg-green-100 text-green-700',
  CLOSED:      'bg-gray-100 text-gray-600',
};

function DashboardSkeleton() {
  return (
    <div className="space-y-5 pb-4">
      <Skeleton className="h-36 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
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
  const openCount = tickets.filter(t => t.status === 'OPEN').length;

  if (loadingUnit) return <DashboardSkeleton />;

  return (
    <div className="space-y-5 pb-4">

      {/* ── Hero / Welcome ────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 p-5 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 right-12 h-28 w-28 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-sm font-medium text-purple-200">Hello 👋</p>
          <h1 className="mt-0.5 text-2xl font-bold">{user?.name ?? 'Tenant'}</h1>
          {unit ? (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-purple-200">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                Unit {unit.unitNumber} · {unit.property?.name}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-purple-200">No unit assigned yet</p>
          )}
          <div className="mt-4">
            <Button size="sm" className="h-8 gap-1.5 rounded-xl bg-white text-purple-700 hover:bg-purple-50" asChild>
              <Link href="/tenant/tickets/new">
                <Plus className="h-3.5 w-3.5" /> Submit Ticket
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Unit card ─────────────────────────────────── */}
      {unit && (
        <Link href="/tenant/my-unit"
          className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-100 to-purple-100">
            <Home className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">Unit {unit.unitNumber}</p>
            <p className="text-sm text-muted-foreground truncate">{unit.property?.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {unit.property?.street}, {unit.property?.city}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>
      )}

      {/* ── Next appointment ──────────────────────────── */}
      {nextAppt && (
        <Link href={`/tenant/tickets/${nextAppt.ticketId}`}
          className="flex items-start gap-4 rounded-2xl border-2 border-blue-200 bg-blue-50 p-4 hover:bg-blue-100 transition-colors">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {tAppts('upcomingTitle')}
            </p>
            <p className="mt-0.5 font-semibold text-sm truncate">{nextAppt.ticket.title}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-blue-700">
              <Clock className="h-3 w-3" />
              {format(new Date(nextAppt.scheduledAt), 'EEEE, dd MMM · HH:mm', { locale: dateLocale })}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-blue-400" />
        </Link>
      )}

      {/* ── Upcoming visits ───────────────────────────── */}
      {upcomingVisits.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold">{tVisits('upcomingTitle')}</p>
          {upcomingVisits.map((visit) => (
            <TenantVisitCard key={visit.id} visit={visit} />
          ))}
        </div>
      )}

      {/* ── Stats row ─────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-lg bg-orange-100 p-1.5">
              <Ticket className="h-4 w-4 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Open Tickets</span>
          </div>
          <p className="text-3xl font-bold">{openCount}</p>
          <Link href="/tenant/tickets" className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-1.5">
              <CalendarDays className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Upcoming Visits</span>
          </div>
          <p className="text-3xl font-bold">{upcomingVisits.length}</p>
          <Link href="/tenant/calendar" className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline">
            View calendar <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* ── Submit ticket CTA ─────────────────────────── */}
      <Button className="h-14 w-full rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 text-base font-semibold shadow-md hover:opacity-90" asChild>
        <Link href="/tenant/tickets/new">
          <Plus className="mr-2 h-5 w-5" />
          {tTickets('submitTicket')}
        </Link>
      </Button>

      {/* ── Recent tickets ────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{tTickets('myTickets')}</p>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-primary" asChild>
            <Link href="/tenant/tickets">View all <ArrowRight className="h-3 w-3" /></Link>
          </Button>
        </div>

        {loadingTickets ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-8 text-center">
            <Wrench className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{tTickets('noTickets')}</p>
            <Button size="sm" className="mt-3" asChild>
              <Link href="/tenant/tickets/new">Report an issue</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm divide-y">
            {tickets.map((ticket) => (
              <Link key={ticket.id} href={`/tenant/tickets/${ticket.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <Ticket className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(ticket.createdAt), 'dd MMM yyyy')}
                  </p>
                </div>
                <Badge className={`shrink-0 text-[10px] ${STATUS_COLOR[ticket.status] ?? ''}`}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Emergency button ──────────────────────────── */}
      <EmergencyButton />
    </div>
  );
}
