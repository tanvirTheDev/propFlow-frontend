'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Building2, Users, Home, MailOpen, Ticket, AlertTriangle,
  CalendarDays, Plus, ChevronRight, ArrowRight, Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketCard } from '@/components/tickets/ticket-card';
import { useLandlordDashboard } from '@/lib/hooks/use-dashboard';
import { useAuthStore } from '@/lib/stores/auth.store';

/* ─── stat card ─────────────────────────────────────────── */
function StatCard({
  label, value, icon: Icon, bg, sub,
}: { label: string; value: number | string; icon: React.ElementType; bg: string; sub?: string }) {
  return (
    <div className={`rounded-2xl p-4 ${bg} flex flex-col gap-3`}>
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider opacity-75">{label}</span>
        <div className="rounded-xl bg-white/20 p-1.5">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold leading-none">{value}</p>
        {sub && <p className="mt-1 text-[11px] opacity-70">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── mini metric card ──────────────────────────────────── */
function MiniCard({ href, icon: Icon, label, value, iconBg, iconColor }: {
  href: string; icon: React.ElementType; label: string;
  value: number; iconBg: string; iconColor: string;
}) {
  return (
    <Link href={href} className="flex flex-col gap-1 rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition-all active:scale-95">
      <div className={`w-fit rounded-lg ${iconBg} p-2 mb-1`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground leading-tight">{label}</p>
    </Link>
  );
}

/* ─── quick action pill ─────────────────────────────────── */
function QuickAction({ href, icon: Icon, label, bg }: {
  href: string; icon: React.ElementType; label: string; bg: string;
}) {
  return (
    <Link href={href} className={`flex flex-col items-center gap-2 rounded-2xl ${bg} p-3.5 transition-all active:scale-95`}>
      <Icon className="h-5 w-5" />
      <span className="text-[11px] font-semibold text-center leading-tight">{label}</span>
    </Link>
  );
}

/* ─── skeleton ──────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="space-y-5 pb-6">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <Skeleton className="h-20 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
    </div>
  );
}

/* ─── page ──────────────────────────────────────────────── */
export default function LandlordDashboardPage() {
  const t = useTranslations('dashboard.landlord');
  const tTickets = useTranslations('tickets');
  const { data: stats, isLoading } = useLandlordDashboard();
  const user = useAuthStore((s) => s.user);

  if (isLoading) return <DashboardSkeleton />;

  const occupancy = stats?.occupancyRate ?? 0;
  const hasEmergency = (stats?.emergencyTickets ?? 0) > 0;

  return (
    <div className="space-y-5 pb-6">

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-12 right-8 h-36 w-36 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-sm font-medium text-blue-200">Welcome back 👋</p>
          <h1 className="mt-0.5 text-2xl font-bold">{user?.name ?? 'Landlord'}</h1>
          <p className="mt-1 text-sm text-blue-200">
            {stats?.totalProperties ?? 0} {stats?.totalProperties === 1 ? 'property' : 'properties'} ·{' '}
            {stats?.totalUnits ?? 0} units total
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" className="h-8 gap-1.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50" asChild>
              <Link href="/landlord/properties/new">
                <Plus className="h-3.5 w-3.5" /> Add Property
              </Link>
            </Button>
            <Button size="sm" variant="ghost" className="h-8 rounded-xl text-white hover:bg-white/20" asChild>
              <Link href="/landlord/invites">
                <MailOpen className="h-3.5 w-3.5 mr-1.5" /> Invite Tenant
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Emergency alert ──────────────────────────── */}
      {hasEmergency && (
        <Link href="/landlord/tickets?emergency=true"
          className="flex items-center gap-3 rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 hover:bg-red-100 transition-colors">
          <div className="shrink-0 rounded-xl bg-red-500 p-2">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-red-800">
              {stats?.emergencyTickets} Emergency Ticket{stats?.emergencyTickets !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-red-600">Requires immediate attention</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-red-400" />
        </Link>
      )}

      {/* ── Main stat cards ───────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Properties" value={stats?.totalProperties ?? 0} icon={Building2}
          bg="bg-linear-to-br from-violet-500 to-purple-700 text-white" />
        <StatCard label="Total Units" value={stats?.totalUnits ?? 0} icon={Home}
          bg="bg-linear-to-br from-cyan-500 to-blue-600 text-white" />
        <StatCard label="Occupied" value={stats?.occupiedUnits ?? 0} icon={Users}
          bg="bg-linear-to-br from-emerald-500 to-green-700 text-white"
          sub={`${occupancy}% rate`} />
        <StatCard label="Vacant" value={stats?.vacantUnits ?? 0} icon={Home}
          bg="bg-linear-to-br from-amber-400 to-orange-500 text-white" />
      </div>

      {/* ── Occupancy bar ─────────────────────────────── */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold">Occupancy Rate</p>
            <p className="text-xs text-muted-foreground">Across all properties</p>
          </div>
          <span className={`text-2xl font-bold ${occupancy >= 80 ? 'text-emerald-600' : occupancy >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
            {occupancy}%
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              occupancy >= 80 ? 'bg-linear-to-r from-emerald-400 to-emerald-600'
              : occupancy >= 50 ? 'bg-linear-to-r from-amber-400 to-amber-600'
              : 'bg-linear-to-r from-red-400 to-red-600'
            }`}
            style={{ width: `${occupancy}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{stats?.occupiedUnits ?? 0} occupied</span>
          <span>{stats?.vacantUnits ?? 0} vacant</span>
        </div>
      </div>

      {/* ── Mini metric cards ─────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniCard href="/landlord/tickets?status=OPEN" icon={Ticket} label="Open tickets"
          value={stats?.openTickets ?? 0} iconBg="bg-orange-100" iconColor="text-orange-600" />
        <MiniCard href="/landlord/tickets?status=IN_PROGRESS" icon={Wrench} label="In progress"
          value={stats?.inProgressTickets ?? 0} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <MiniCard href="/landlord/calendar" icon={CalendarDays} label="Visits this week"
          value={stats?.upcomingVisits ?? 0} iconBg="bg-purple-100" iconColor="text-purple-600" />
        <MiniCard href="/landlord/invites" icon={MailOpen} label="Pending invites"
          value={stats?.pendingInvites ?? 0} iconBg="bg-teal-100" iconColor="text-teal-600" />
      </div>

      {/* ── Quick actions ─────────────────────────────── */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Quick Actions</p>
        <div className="grid grid-cols-4 gap-2">
          <QuickAction href="/landlord/tickets" icon={Ticket} label="Tickets" bg="bg-orange-50 text-orange-700" />
          <QuickAction href="/landlord/properties" icon={Building2} label="Properties" bg="bg-violet-50 text-violet-700" />
          <QuickAction href="/landlord/calendar" icon={CalendarDays} label="Calendar" bg="bg-purple-50 text-purple-700" />
          <QuickAction href="/landlord/invites" icon={MailOpen} label="Invites" bg="bg-teal-50 text-teal-700" />
        </div>
      </div>

      {/* ── Recent properties ─────────────────────────── */}
      {(stats?.recentProperties?.length ?? 0) > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-semibold">{t('recentProperties')}</p>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-primary" asChild>
              <Link href="/landlord/properties">View all <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="divide-y">
            {stats!.recentProperties.map((p) => (
              <Link key={p.id} href={`/landlord/properties/${p.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                  <Building2 className="h-4 w-4 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.street}, {p.city}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent tickets ────────────────────────────── */}
      {(stats?.recentTickets?.length ?? 0) > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{tTickets('recentTickets')}</p>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-primary" asChild>
              <Link href="/landlord/tickets">View all <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="space-y-2">
            {stats!.recentTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} href={`/landlord/tickets/${ticket.id}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
