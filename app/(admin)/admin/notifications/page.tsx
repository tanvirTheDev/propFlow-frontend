'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationQueueTable } from '@/components/admin/notification-queue-table';
import { useNotificationQueue } from '@/lib/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_OPTIONS = ['ALL', 'FAILED', 'PENDING', 'PROCESSING', 'SENT', 'CANCELLED'] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

export default function NotificationsQueuePage() {
  const t = useTranslations('admin.queue');
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const { data: entries, isLoading, refetch, isRefetching } = useNotificationQueue(
    status === 'ALL' ? undefined : { status },
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          {t('refresh')}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              status === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <NotificationQueueTable entries={entries ?? []} />
      )}
    </div>
  );
}
