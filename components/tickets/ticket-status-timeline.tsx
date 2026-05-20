'use client';

import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';
import type { TicketStatusLog } from '@/lib/api/types';

export function TicketStatusTimeline({ history }: { history: TicketStatusLog[] }) {
  const t = useTranslations('tickets.status');

  return (
    <ol className="relative border-l border-border ml-3 space-y-4">
      {history.map((entry, i) => (
        <li key={entry.id} className="ml-6">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-background ring-2 ring-border">
            <CheckCircle2 className={`h-4 w-4 ${i === history.length - 1 ? 'text-primary' : 'text-muted-foreground'}`} />
          </span>
          <div>
            <p className="text-sm font-medium">
              {entry.fromStatus ? `${t(entry.fromStatus)} → ` : ''}{t(entry.toStatus)}
            </p>
            <time className="text-xs text-muted-foreground">
              {format(new Date(entry.changedAt), 'dd MMM yyyy, HH:mm')}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}
