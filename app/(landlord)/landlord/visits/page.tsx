'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import {
  ClipboardList, Clock, CheckCircle2, XCircle, Calendar,
  Building2, MapPin, Users, Timer, TrendingUp, Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { VisitDetailSheet } from '@/components/visits/visit-detail-sheet';
import { useVisits } from '@/lib/hooks/use-visits';
import { useProperties } from '@/lib/hooks/use-properties';
import type { LandlordVisit } from '@/lib/api/types';

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration(mins: number): string {
  if (mins <= 0) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatTotalHours(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

const STATUS_STYLES: Record<string, { badge: string; icon: React.ReactNode }> = {
  SCHEDULED: {
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <Calendar className="h-3 w-3" />,
  },
  COMPLETED: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  CANCELLED: {
    badge: 'bg-gray-100 text-gray-500 border-gray-200',
    icon: <XCircle className="h-3 w-3" />,
  },
};

const REASON_LABELS: Record<string, string> = {
  ROUTINE_INSPECTION: 'Routine Inspection',
  METER_READING: 'Meter Reading',
  MAINTENANCE_CHECK: 'Maintenance Check',
  VIEWING: 'Property Viewing',
  OTHER: 'Other',
};

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  gradient: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm">
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10 ${gradient}`} />
      <div className="relative flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${gradient} text-white shadow-sm`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
          <p className="mt-0.5 text-2xl font-black text-gray-900">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Visit row ────────────────────────────────────────────────────────────────

function VisitRow({
  visit,
  locale,
  onClick,
}: {
  visit: LandlordVisit;
  locale: string;
  onClick: () => void;
}) {
  const dateLocale = locale === 'de' ? de : enUS;
  const scheduled = new Date(visit.scheduledAt);
  const statusStyle = STATUS_STYLES[visit.status] ?? STATUS_STYLES.SCHEDULED;

  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm text-left transition-all hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 group"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        {/* Left: property + date */}
        <div className="flex items-start gap-3 min-w-0">
          {/* Status colour bar */}
          <div
            className={`mt-1 h-10 w-1 shrink-0 rounded-full ${
              visit.status === 'COMPLETED' ? 'bg-emerald-400' :
              visit.status === 'CANCELLED' ? 'bg-gray-300' :
              'bg-blue-400'
            }`}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                {visit.property.name}
              </p>
              <Badge className={`flex items-center gap-1 text-xs ${statusStyle.badge}`}>
                {statusStyle.icon}
                {visit.status.charAt(0) + visit.status.slice(1).toLowerCase()}
              </Badge>
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="h-3 w-3" />
              {visit.property.street}, {visit.property.city}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              {format(scheduled, 'EEE dd MMM yyyy', { locale: dateLocale })}
              {' · '}
              {format(scheduled, 'HH:mm')}
            </p>
          </div>
        </div>

        {/* Right: duration + units */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* Duration badge — only for completed */}
          {visit.status === 'COMPLETED' && visit.durationMin > 0 ? (
            <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5">
              <Timer className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-sm font-black text-emerald-700">
                {formatDuration(visit.durationMin)}
              </span>
            </div>
          ) : visit.status === 'SCHEDULED' ? (
            <div className="flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs text-blue-600 font-medium">Upcoming</span>
            </div>
          ) : null}

          {/* Units count */}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users className="h-3 w-3" />
            {visit.units.length} unit{visit.units.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Reason pill */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {REASON_LABELS[visit.reason] ?? visit.reason}
        </span>
        {visit.note && (
          <span className="text-xs text-gray-400 italic truncate max-w-48">"{visit.note}"</span>
        )}
      </div>
    </button>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

type StatusFilter = 'ALL' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export default function VisitsPage() {
  const t = useTranslations('visits');
  const locale = useLocale();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [selectedVisit, setSelectedVisit] = useState<LandlordVisit | null>(null);

  const { data: visits = [], isLoading } = useVisits();
  const { data: propertiesData } = useProperties();
  const properties = propertiesData?.data ?? [];

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const completed = visits.filter((v) => v.status === 'COMPLETED');
    const scheduled = visits.filter((v) => v.status === 'SCHEDULED');
    const totalMins = completed.reduce((sum, v) => sum + (v.durationMin ?? 0), 0);
    const avgMins = completed.length > 0 ? Math.round(totalMins / completed.length) : 0;
    return { total: visits.length, completed: completed.length, scheduled: scheduled.length, totalMins, avgMins };
  }, [visits]);

  // ── Filtered + sorted ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return visits
      .filter((v) => statusFilter === 'ALL' || v.status === statusFilter)
      .filter((v) => !propertyFilter || v.propertyId === propertyFilter)
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  }, [visits, statusFilter, propertyFilter]);

  // ── Group by property for property-based summary ───────────────────────────
  const propertyDurations = useMemo(() => {
    const map = new Map<string, { name: string; totalMins: number; visits: number }>();
    visits
      .filter((v) => v.status === 'COMPLETED' && v.durationMin > 0)
      .forEach((v) => {
        const existing = map.get(v.propertyId);
        if (existing) {
          existing.totalMins += v.durationMin;
          existing.visits++;
        } else {
          map.set(v.propertyId, { name: v.property.name, totalMins: v.durationMin, visits: 1 });
        }
      });
    return Array.from(map.values()).sort((a, b) => b.totalMins - a.totalMins);
  }, [visits]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600 via-violet-600 to-purple-700 px-6 py-5 text-white shadow-lg shadow-indigo-500/20">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-24 h-24 w-24 rounded-full bg-purple-400/20 blur-2xl" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black leading-tight">Visit History</h1>
              <p className="text-sm text-indigo-200">All your property visits & time tracking</p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
            {stats.total} total visits
          </Badge>
        </div>
      </div>

      {/* ── Stats ── */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1,2,3,4].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<ClipboardList className="h-5 w-5" />}
            label="Total Visits"
            value={String(stats.total)}
            gradient="from-indigo-500 to-violet-600"
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Completed"
            value={String(stats.completed)}
            gradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={<Timer className="h-5 w-5" />}
            label="Total Time"
            value={formatTotalHours(stats.totalMins)}
            sub="across all properties"
            gradient="from-amber-500 to-orange-500"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Avg Duration"
            value={stats.avgMins > 0 ? formatDuration(stats.avgMins) : '—'}
            sub="per completed visit"
            gradient="from-blue-500 to-cyan-500"
          />
        </div>
      )}

      {/* ── Per-property time breakdown ── */}
      {!isLoading && propertyDurations.length > 0 && (
        <div className="rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
            <Building2 className="h-4 w-4" />
            Time Spent Per Property
          </h2>
          <div className="space-y-3">
            {propertyDurations.map((p) => {
              const pct = stats.totalMins > 0 ? (p.totalMins / stats.totalMins) * 100 : 0;
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-semibold text-gray-800">{p.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{p.visits} visit{p.visits !== 1 ? 's' : ''}</span>
                      <span className="font-black text-indigo-700 min-w-12 text-right">
                        {formatTotalHours(p.totalMins)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          {(['ALL', 'SCHEDULED', 'COMPLETED', 'CANCELLED'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={[
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100',
              ].join(' ')}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {properties.length > 0 && (
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
          >
            <option value="">All Properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}

        {(statusFilter !== 'ALL' || propertyFilter) && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
            onClick={() => { setStatusFilter('ALL'); setPropertyFilter(''); }}
          >
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}

        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Visit list ── */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <ClipboardList className="h-7 w-7 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-600">No visits found</p>
          <p className="mt-1 text-xs text-gray-400">
            {statusFilter !== 'ALL' ? 'Try changing the filter' : 'Schedule your first visit from the Calendar page'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((visit) => (
            <VisitRow
              key={visit.id}
              visit={visit}
              locale={locale}
              onClick={() => setSelectedVisit(visit)}
            />
          ))}
        </div>
      )}

      {/* Detail sheet */}
      <VisitDetailSheet
        visit={selectedVisit}
        open={Boolean(selectedVisit)}
        isLandlord
        onClose={() => setSelectedVisit(null)}
      />
    </div>
  );
}
