'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Building2, Users, Home, MailOpen, Ticket, AlertTriangle,
  CalendarDays, Plus, ChevronRight, ArrowRight, Wrench,
  TrendingUp, Zap, Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketCard } from '@/components/tickets/ticket-card';
import { AnimatedCounter } from '@/components/animations/animated-counter';
import { useLandlordDashboard } from '@/lib/hooks/use-dashboard';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useGsapReveal } from '@/lib/hooks/use-gsap-reveal';

/* ─── gradient stat card ────────────────────────────────── */
function StatCard({
  label, value, icon: Icon, gradient, delay = 0,
}: {
  label: string; value: number; icon: React.ElementType;
  gradient: string; delay?: number;
}) {
  return (
    <div
      className={`card-hover relative overflow-hidden rounded-2xl p-5 text-white ${gradient} shadow-lg`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative circle */}
      <div className="pointer-events-none absolute -right-5 -top-5 h-28 w-28 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-white/5" />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">{label}</span>
          <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="text-4xl font-black leading-none">
          <AnimatedCounter value={value} delay={0.1 + delay / 1000} />
        </p>
      </div>
    </div>
  );
}

/* ─── metric mini card ──────────────────────────────────── */
function MiniCard({ href, icon: Icon, label, value, iconBg, iconColor }: {
  href: string; icon: React.ElementType; label: string;
  value: number; iconBg: string; iconColor: string;
}) {
  return (
    <Link
      href={href}
      className="card-hover group flex flex-col gap-2 rounded-2xl border border-border/60 bg-white p-4 shadow-sm"
    >
      <div className={`w-fit rounded-xl ${iconBg} p-2.5`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <p className="text-2xl font-black text-foreground">
        <AnimatedCounter value={value} delay={0.4} />
      </p>
      <p className="text-xs font-medium text-muted-foreground leading-tight">{label}</p>
    </Link>
  );
}

/* ─── quick action ──────────────────────────────────────── */
function QuickAction({ href, icon: Icon, label, gradient }: {
  href: string; icon: React.ElementType; label: string; gradient: string;
}) {
  return (
    <Link
      href={href}
      className={`card-hover flex flex-col items-center gap-2.5 rounded-2xl ${gradient} p-4 text-white shadow-md`}
    >
      <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[11px] font-bold text-center leading-tight tracking-wide">{label}</span>
    </Link>
  );
}

/* ─── skeleton ──────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-40 rounded-3xl" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
      </div>
      <Skeleton className="h-24 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
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

  /* GSAP: stagger the main sections on mount */
  const pageRef = useGsapReveal<HTMLDivElement>({ stagger: 0.07, fromY: 24 });
  const cardsRef = useGsapReveal<HTMLDivElement>({ stagger: 0.08, delay: 0.1, fromY: 30 });
  const miniRef  = useGsapReveal<HTMLDivElement>({ stagger: 0.06, delay: 0.2, fromY: 20 });

  if (isLoading) return <DashboardSkeleton />;

  const occupancy    = stats?.occupancyRate ?? 0;
  const hasEmergency = (stats?.emergencyTickets ?? 0) > 0;

  return (
    <div ref={pageRef} className="space-y-5 pb-4">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-500/20">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-violet-500/30 blur-2xl" />
        <div className="pointer-events-none absolute right-24 bottom-4 h-20 w-20 rounded-full bg-blue-300/20 blur-xl float" />

        <div className="relative">
          <div className="mb-1 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <Star className="h-3 w-3 text-amber-300" fill="currentColor" />
              Landlord Portal
            </div>
          </div>
          <p className="mt-2 text-sm font-medium text-blue-200">Welcome back 👋</p>
          <h1 className="mt-0.5 text-3xl font-black tracking-tight">{user?.name ?? 'Landlord'}</h1>
          <p className="mt-1.5 flex items-center gap-3 text-sm text-blue-200">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {stats?.totalProperties ?? 0} {stats?.totalProperties === 1 ? 'property' : 'properties'}
            </span>
            <span className="h-1 w-1 rounded-full bg-blue-400" />
            <span className="flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              {stats?.totalUnits ?? 0} units
            </span>
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="sm" variant="outline"
              className="h-9 gap-2 rounded-xl border-white/40 bg-white font-semibold text-indigo-700 shadow-lg hover:bg-white/90 hover:scale-105 active:scale-95 transition-all"
              asChild>
              <Link href="/landlord/properties/new">
                <Plus className="h-4 w-4" /> Add Property
              </Link>
            </Button>
            <Button size="sm" variant="ghost"
              className="h-9 rounded-xl font-medium text-white hover:bg-white/20 backdrop-blur-sm"
              asChild>
              <Link href="/landlord/invites">
                <MailOpen className="h-4 w-4 mr-1.5" /> Invite Tenant
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Emergency alert ──────────────────────────────── */}
      {hasEmergency && (
        <Link
          href="/landlord/tickets?emergency=true"
          className="card-hover flex items-center gap-3 rounded-2xl border-2 border-red-300 bg-linear-to-r from-red-50 to-rose-50 px-4 py-3.5 shadow-sm hover:shadow-red-100 transition-all"
        >
          <div className="shrink-0 rounded-xl bg-red-500 p-2.5 shadow-md shadow-red-200 pulse-glow">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800">
              {stats?.emergencyTickets} Emergency Ticket{stats?.emergencyTickets !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-red-500">Requires immediate attention</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-red-400" />
        </Link>
      )}

      {/* ── Stat cards ───────────────────────────────────── */}
      <div ref={cardsRef} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Properties" value={stats?.totalProperties ?? 0}
          icon={Building2} gradient="bg-linear-to-br from-violet-500 to-purple-700" delay={0} />
        <StatCard label="Total Units" value={stats?.totalUnits ?? 0}
          icon={Home} gradient="bg-linear-to-br from-cyan-500 to-blue-600" delay={80} />
        <StatCard label="Occupied" value={stats?.occupiedUnits ?? 0}
          icon={Users} gradient="bg-linear-to-br from-emerald-400 to-green-600" delay={160} />
        <StatCard label="Vacant" value={stats?.vacantUnits ?? 0}
          icon={Home} gradient="bg-linear-to-br from-amber-400 to-orange-500" delay={240} />
      </div>

      {/* ── Occupancy bar ─────────────────────────────────── */}
      <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Occupancy Rate
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Across all properties</p>
          </div>
          <span
            className={`text-3xl font-black tabular-nums ${
              occupancy >= 80 ? 'text-emerald-600'
              : occupancy >= 50 ? 'text-amber-500'
              : 'text-red-500'
            }`}
          >
            <AnimatedCounter value={occupancy} suffix="%" delay={0.5} />
          </span>
        </div>
        {/* Track */}
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              occupancy >= 80 ? 'bg-linear-to-r from-emerald-400 to-emerald-600'
              : occupancy >= 50 ? 'bg-linear-to-r from-amber-400 to-amber-600'
              : 'bg-linear-to-r from-red-400 to-red-500'
            }`}
            style={{ width: `${occupancy}%` }}
          />
        </div>
        <div className="mt-2.5 flex justify-between text-xs text-muted-foreground">
          <span className="font-medium">{stats?.occupiedUnits ?? 0} occupied</span>
          <span className="font-medium">{stats?.vacantUnits ?? 0} vacant</span>
        </div>
      </div>

      {/* ── Mini metric cards ─────────────────────────────── */}
      <div ref={miniRef} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniCard href="/landlord/tickets?status=OPEN" icon={Ticket} label="Open tickets"
          value={stats?.openTickets ?? 0} iconBg="bg-orange-100" iconColor="text-orange-600" />
        <MiniCard href="/landlord/tickets?status=IN_PROGRESS" icon={Wrench} label="In progress"
          value={stats?.inProgressTickets ?? 0} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <MiniCard href="/landlord/calendar" icon={CalendarDays} label="Visits this week"
          value={stats?.upcomingVisits ?? 0} iconBg="bg-purple-100" iconColor="text-purple-600" />
        <MiniCard href="/landlord/invites" icon={MailOpen} label="Pending invites"
          value={stats?.pendingInvites ?? 0} iconBg="bg-teal-100" iconColor="text-teal-600" />
      </div>

      {/* ── Quick actions ─────────────────────────────────── */}
      <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />
          Quick Actions
        </p>
        <div className="grid grid-cols-4 gap-2.5">
          <QuickAction href="/landlord/tickets" icon={Ticket} label="Tickets"
            gradient="bg-linear-to-br from-orange-400 to-red-500" />
          <QuickAction href="/landlord/properties" icon={Building2} label="Properties"
            gradient="bg-linear-to-br from-violet-500 to-purple-600" />
          <QuickAction href="/landlord/calendar" icon={CalendarDays} label="Calendar"
            gradient="bg-linear-to-br from-indigo-500 to-blue-600" />
          <QuickAction href="/landlord/invites" icon={MailOpen} label="Invites"
            gradient="bg-linear-to-br from-teal-400 to-emerald-600" />
        </div>
      </div>

      {/* ── Recent properties ─────────────────────────────── */}
      {(stats?.recentProperties?.length ?? 0) > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3.5">
            <p className="font-bold text-sm">{t('recentProperties')}</p>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-primary hover:text-primary/80" asChild>
              <Link href="/landlord/properties">View all <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="divide-y divide-border/50">
            {stats!.recentProperties.map((p) => (
              <Link key={p.id} href={`/landlord/properties/${p.id}`}
                className="group flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-100 to-purple-100">
                  <Building2 className="h-5 w-5 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.street}, {p.city}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent tickets ────────────────────────────────── */}
      {(stats?.recentTickets?.length ?? 0) > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm">{tTickets('recentTickets')}</p>
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
