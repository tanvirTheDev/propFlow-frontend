'use client';

import Link from 'next/link';
import { useTranslations, useFormatter } from 'next-intl';
import {
  Building2, Users, Home, Plus, AlertTriangle, ChevronRight,
  ArrowRight, Bell, BarChart3, ShieldCheck, Mail, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedCounter } from '@/components/animations/animated-counter';
import { useAdminStats, useOrganisations } from '@/lib/hooks/use-admin';
import { useGsapReveal } from '@/lib/hooks/use-gsap-reveal';

/* ─── stat card ─────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, gradient }: {
  label: string; value: number; icon: React.ElementType; gradient: string;
}) {
  return (
    <div className={`card-hover relative overflow-hidden rounded-2xl p-5 text-white ${gradient} shadow-lg`}>
      <div className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10" />
      <div className="relative">
        <div className="mb-3 flex items-start justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">{label}</span>
          <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="text-4xl font-black leading-none">
          <AnimatedCounter value={value} delay={0.2} />
        </p>
      </div>
    </div>
  );
}

/* ─── platform metric row ───────────────────────────────── */
function MetricRow({ label, value, icon: Icon, iconBg, iconColor }: {
  label: string; value: number; icon: React.ElementType;
  iconBg: string; iconColor: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <p className="flex-1 text-sm font-semibold">{label}</p>
      <span className="text-lg font-black tabular-nums">
        <AnimatedCounter value={value} delay={0.5} />
      </span>
    </div>
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
      <Skeleton className="h-56 rounded-2xl" />
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}

/* ─── page ──────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const t = useTranslations('admin');
  const format = useFormatter();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: orgsData, isLoading: orgsLoading } = useOrganisations({ page: 1, limit: 5 });

  const pageRef  = useGsapReveal<HTMLDivElement>({ stagger: 0.07, fromY: 22 });
  const cardsRef = useGsapReveal<HTMLDivElement>({ stagger: 0.08, delay: 0.1, fromY: 28 });

  if (statsLoading) return <DashboardSkeleton />;

  const s = stats as any;
  const hasFailedNotifications = (s?.failedNotifications ?? 0) > 0;

  return (
    <div ref={pageRef} className="space-y-5 pb-4">

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-800 via-slate-900 to-gray-950 p-6 text-white shadow-xl shadow-slate-900/30">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 left-6 h-44 w-44 rounded-full bg-indigo-500/10 blur-2xl" />
        <div className="pointer-events-none absolute right-20 bottom-4 h-16 w-16 rounded-full bg-blue-400/10 blur-xl float" />

        <div className="relative">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-300 backdrop-blur-sm border border-red-500/20">
            <ShieldCheck className="h-3 w-3" /> Super Admin
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Platform Overview</h1>
          <p className="mt-1.5 flex items-center gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {s?.organisations ?? 0} organisations
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {s?.totalUsers ?? ((s?.landlords ?? 0) + (s?.tenants ?? 0))} users
            </span>
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="sm" variant="outline"
              className="h-9 gap-2 rounded-xl border-white/40 bg-white font-semibold text-slate-900 shadow-lg hover:bg-white/90 hover:scale-105 active:scale-95 transition-all"
              asChild>
              <Link href="/admin/organisations/new">
                <Plus className="h-4 w-4" /> New Organisation
              </Link>
            </Button>
            <Button size="sm" variant="ghost"
              className="h-9 rounded-xl font-medium text-white hover:bg-white/20"
              asChild>
              <Link href="/admin/notifications">
                <Bell className="h-4 w-4 mr-1.5" /> Notifications
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Failed notifications alert ───────────────── */}
      {hasFailedNotifications && (
        <Link href="/admin/notifications"
          className="card-hover flex items-center gap-3 rounded-2xl border-2 border-amber-300 bg-linear-to-r from-amber-50 to-yellow-50 px-4 py-3.5 shadow-sm">
          <div className="shrink-0 rounded-xl bg-amber-500 p-2.5 shadow-md shadow-amber-200 pulse-glow">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">
              {s?.failedNotifications} Failed Notification{s?.failedNotifications !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-amber-600">Review and retry failed deliveries</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-amber-500" />
        </Link>
      )}

      {/* ── Stat cards ───────────────────────────────── */}
      <div ref={cardsRef} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Organisations" value={s?.organisations ?? s?.totalOrgs ?? 0}
          icon={Building2} gradient="bg-linear-to-br from-slate-600 to-slate-800" />
        <StatCard label="Properties" value={s?.properties ?? s?.totalProperties ?? 0}
          icon={Home} gradient="bg-linear-to-br from-violet-500 to-purple-700" />
        <StatCard label="Landlords" value={s?.landlords ?? 0}
          icon={Users} gradient="bg-linear-to-br from-blue-500 to-indigo-700" />
        <StatCard label="Tenants" value={s?.tenants ?? 0}
          icon={Users} gradient="bg-linear-to-br from-emerald-500 to-green-700" />
      </div>

      {/* ── Platform metrics ──────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3.5">
          <div className="rounded-lg bg-indigo-100 p-1.5">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="font-bold text-sm">Platform Metrics</p>
        </div>
        <div className="divide-y divide-border/50 px-4">
          <MetricRow label="Total Units"  value={s?.units ?? s?.totalUnits ?? 0}
            icon={Home}          iconBg="bg-cyan-100"   iconColor="text-cyan-600" />
          <MetricRow label="Open Tickets" value={s?.tickets?.open ?? 0}
            icon={AlertTriangle} iconBg="bg-orange-100" iconColor="text-orange-600" />
          <MetricRow label="In Progress"  value={s?.tickets?.inProgress ?? 0}
            icon={Building2}     iconBg="bg-blue-100"   iconColor="text-blue-600" />
          <MetricRow label="Emergencies"  value={s?.tickets?.emergencies ?? 0}
            icon={AlertTriangle} iconBg="bg-red-100"    iconColor="text-red-600" />
          <MetricRow label="Emails Today" value={s?.emailsSentToday ?? 0}
            icon={Mail}          iconBg="bg-teal-100"   iconColor="text-teal-600" />
        </div>
      </div>

      {/* ── Recent organisations ──────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3.5">
          <p className="font-bold text-sm">{t('dashboard.recentOrgs')}</p>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-primary" asChild>
            <Link href="/admin/organisations">View all <ArrowRight className="h-3 w-3" /></Link>
          </Button>
        </div>

        {orgsLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : orgsData?.data.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Building2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t('dashboard.noOrgs')}</p>
            <Button size="sm" className="mt-3 rounded-xl" asChild>
              <Link href="/admin/organisations/new">Create first organisation</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {orgsData?.data.map((org) => (
              <Link key={org.id} href={`/admin/organisations/${org.id}`}
                className="group flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200">
                  <Building2 className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{org.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {org.landlordCount} landlords · {org.tenantCount} tenants · {org.propertyCount} properties
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">
                    {format.dateTime(new Date(org.createdAt), { day: '2-digit', month: 'short' })}
                  </p>
                  <ChevronRight className="ml-auto mt-1 h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick actions ─────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <Button size="lg"
          className="card-hover h-14 rounded-2xl bg-linear-to-r from-slate-700 to-slate-900 font-bold shadow-lg hover:shadow-slate-400/30 transition-all"
          asChild>
          <Link href="/admin/organisations/new">
            <Plus className="mr-2 h-5 w-5" /> New Organisation
          </Link>
        </Button>
        <Button size="lg" variant="outline"
          className="card-hover h-14 rounded-2xl font-bold hover:border-amber-300 hover:bg-amber-50 transition-all"
          asChild>
          <Link href="/admin/notifications">
            <Bell className="mr-2 h-5 w-5" /> Failed Alerts
          </Link>
        </Button>
      </div>
    </div>
  );
}
