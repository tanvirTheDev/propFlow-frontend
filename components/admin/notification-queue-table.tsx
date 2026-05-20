'use client';

import { useTranslations, useFormatter } from 'next-intl';
import type { NotificationQueueEntry } from '@/lib/api/types';

interface Props {
  entries: NotificationQueueEntry[];
}

const STATUS_COLORS: Record<string, string> = {
  SENT: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

export function NotificationQueueTable({ entries }: Props) {
  const t = useTranslations('admin.queue');
  const format = useFormatter();

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('type')}</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('channels')}</th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t('attempts')}</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('scheduledAt')}</th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t('status')}</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">{t('empty')}</td>
            </tr>
          )}
          {entries.map((entry) => (
            <tr key={entry.id} className={`border-b last:border-0 ${entry.status === 'FAILED' ? 'bg-red-50' : ''}`}>
              <td className="px-4 py-3 font-mono text-xs">{entry.type}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{entry.channels.join(', ')}</td>
              <td className="px-4 py-3 text-center">{entry.attempts}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {format.dateTime(new Date(entry.scheduledAt), { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[entry.status] ?? 'bg-gray-100'}`}>
                  {entry.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
