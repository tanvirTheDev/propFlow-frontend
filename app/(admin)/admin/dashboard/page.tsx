'use client';

import Link from 'next/link';
import { useTranslations, useFormatter } from 'next-intl';
import {
  Building2, Users, Home, Plus, AlertTriangle, ChevronRight,
  ArrowRight, Bell, BarChart3, ShieldCheck, Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminStats, useOrganisations } from '@/lib/hooks/use-admin';

/* ─── stat card ─────────────────────────────────────────── */
function StatCard({
  label, value, icon: Icon, bg, sub,
}: { label: string; value: number; icon: React.ElementType; bg: string; sub?: string }) {
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

/* ─── platform metric row ───────────────────────────────── */
function MetricRow({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: React.ElementType; color: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
      </div>
      <span className="text-lg font-bold">{value.toLocaleString()}</span>
    </div>
  );
}

/* ─── skeleton ──────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-32 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <Skeleton className="h-52 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

/* ─── page ──────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const t = useTranslations('admin');
  const format = useFormatter();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: orgsData, isLoading: orgsLoading } = useOrganisations({ page: 1, limit: 5 });

  if (statsLoading) return <DashboardSkeleton />;

  const s = stats as any;
  const hasFailedNotifications = (s?.failedNotifications ?? 0) > 0;

  return (
    <div className="space-y-5">

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-800 via-slate-900 to-gray-900 p-5 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 right-12 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-300">
              <ShieldCheck className="h-3 w-3" /> Super Admin
            </div>
            <h1 className="text-2xl font-bold">Platform Overview</h1>
            <p className="mt-1 text-sm text-slate-400">
              {s?.organisations ?? 0} organisations · {s?.totalUsers ?? ((s?.landlords ?? 0) + (s?.tenants ?? 0))} users
            </p>
          </div>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-2">
          <Button size="sm" className="h-8 gap-1.5 rounded-xl bg-white text-slate-900 hover:bg-gray-100" asChild>
            <Link href="/admin/organisations/new">
              <Plus className="h-3.5 w-3.5" /> New Organisation
            </Link>
          </Button>
          <Button size="sm" variant="ghost" className="h-8 rounded-xl text-white hover:bg-white/20" asChild>
            <Link href="/admin/notifications">
              <Bell className="h-3.5 w-3.5 mr-1.5" /> Notifications
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Failed notifications alert ───────────────── */}
      {hasFailedNotifications && (
        <Link href="/admin/notifications"
          className="flex items-center gap-3 rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-3 hover:bg-amber-100 transition-colors">
          <div className="shrink-0 rounded-xl bg-amber-500 p-2">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">{s?.failedNotifications} Failed Notification{s?.failedNotifications !== 1 ? 's' : ''}</p>
            <p className="text-xs text-amber-600">Review and retry failed deliveries</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-amber-500" />
        </Link>
      )}

      {/* ── Top stat cards ────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Organisations" value={s?.organisations ?? s?.totalOrgs ?? 0}
          icon={Building2} bg="bg-linear-to-br from-slate-600 to-slate-800 text-white" />
        <StatCard label="Properties" value={s?.properties ?? s?.totalProperties ?? 0}
          icon={Home} bg="bg-linear-to-br from-violet-500 to-purple-700 text-white" />
        <StatCard label="Landlords" value={s?.landlords ?? 0}
          icon={Users} bg="bg-linear-to-br from-blue-500 to-blue-700 text-white" />
        <StatCard label="Tenants" value={s?.tenants ?? 0}
          icon={Users} bg="bg-linear-to-br from-emerald-500 to-green-700 text-white" />
      </div>

      {/* ── Platform metrics ──────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold">Platform Metrics</p>
        </div>
        <div className="divide-y px-4">
          <MetricRow label="Total Units" value={s?.units ?? s?.totalUnits ?? 0}
            icon={Home} color="bg-cyan-100 text-cyan-600" />
          <MetricRow label="Open Tickets" value={s?.tickets?.open ?? 0}
            icon={AlertTriangle} color="bg-orange-100 text-orange-600" />
          <MetricRow label="In Progress" value={s?.tickets?.inProgress ?? 0}
            icon={Building2} color="bg-blue-100 text-blue-600" />
          <MetricRow label="Emergencies" value={s?.tickets?.emergencies ?? 0}
            icon={AlertTriangle} color="bg-red-100 text-red-600" />
          <MetricRow label="Emails Today" value={s?.emailsSentToday ?? 0}
            icon={Mail} color="bg-teal-100 text-teal-600" />
        </div>
      </div>

      {/* ── Recent organisations ──────────────────────── */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">{t('dashboard.recentOrgs')}</p>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-primary" asChild>
            <Link href="/admin/organisations">View all <ArrowRight className="h-3 w-3" /></Link>
          </Button>
        </div>

        {orgsLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : orgsData?.data.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Building2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t('dashboard.noOrgs')}</p>
            <Button size="sm" className="mt-3" asChild>
              <Link href="/admin/organisations/new">Create first organisation</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {orgsData?.data.map((org) => (
              <Link key={org.id} href={`/admin/organisations/${org.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200">
                  <Building2 className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{org.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {org.landlordCount} landlords · {org.tenantCount} tenants · {org.propertyCount} properties
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">
                    {format.dateTime(new Date(org.createdAt), { day: '2-digit', month: 'short' })}
                  </p>
                  <ChevronRight className="ml-auto mt-1 h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick actions ─────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <Button size="lg" className="h-14 rounded-2xl bg-linear-to-r from-slate-700 to-slate-900 font-semibold shadow" asChild>
          <Link href="/admin/organisations/new">
            <Plus className="mr-2 h-5 w-5" /> New Organisation
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="h-14 rounded-2xl font-semibold" asChild>
          <Link href="/admin/notifications">
            <Bell className="mr-2 h-5 w-5" /> Failed Alerts
          </Link>
        </Button>
      </div>
    </div>
  );
}
