'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { RefreshCw, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationQueueTable } from '@/components/admin/notification-queue-table';
import { useNotificationQueue } from '@/lib/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = ['ALL', 'FAILED', 'PENDING', 'PROCESSING', 'SENT', 'CANCELLED'] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

/* Status pill color */
const statusPillColors: Record<StatusFilter, string> = {
  ALL:        'bg-slate-800 text-white',
  FAILED:     'bg-red-500 text-white',
  PENDING:    'bg-amber-500 text-white',
  PROCESSING: 'bg-blue-500 text-white',
  SENT:       'bg-emerald-500 text-white',
  CANCELLED:  'bg-slate-400 text-white',
};

export default function NotificationsQueuePage() {
  const t = useTranslations('admin.queue');
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const { data: entries, isLoading, refetch, isRefetching } = useNotificationQueue(
    status === 'ALL' ? undefined : { status },
  );

  return (
    <div className="space-y-4">
      {/* ── Compact dark slate page header ───────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-700 via-slate-800 to-gray-900 px-5 py-4 text-white shadow-md shadow-slate-700/30">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-16 h-20 w-20 rounded-full bg-slate-500/20 blur-xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black leading-tight">{t('title')}</h1>
              <p className="text-xs text-slate-400">{t('subtitle')}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 rounded-xl border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={cn('h-4 w-4', isRefetching && 'animate-spin')} />
            {t('refresh')}
          </Button>
        </div>
      </div>

      {/* ── Status filter pills ───────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all',
              status === s
                ? statusPillColors[s]
                : 'border border-border/60 bg-white text-muted-foreground hover:bg-muted/60 shadow-sm',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ── Table / loading ───────────────────────────────── */}
      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
          <NotificationQueueTable entries={entries ?? []} />
        </div>
      )}
    </div>
  );
}
