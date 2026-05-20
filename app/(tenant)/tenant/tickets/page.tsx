'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketCard } from '@/components/tickets/ticket-card';
import { useTickets } from '@/lib/hooks/use-tickets';
import { cn } from '@/lib/utils';
import type { TicketStatus } from '@/lib/api/types';
import { useState } from 'react';

const FILTERS: Array<{ key: TicketStatus | 'ALL'; label: string }> = [
  { key: 'ALL', label: 'filters.all' },
  { key: 'OPEN', label: 'filters.open' },
  { key: 'IN_PROGRESS', label: 'filters.inProgress' },
  { key: 'FIXED', label: 'filters.fixed' },
  { key: 'CLOSED', label: 'filters.closed' },
];

export default function TenantTicketsPage() {
  const t = useTranslations('tickets');
  const [active, setActive] = useState<TicketStatus | 'ALL'>('ALL');

  const { data, isLoading } = useTickets(active !== 'ALL' ? { status: active } : undefined);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t('myTickets')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button asChild>
          <Link href="/tenant/tickets/new">
            <Plus className="mr-1.5 h-4 w-4" />
            {t('newTicket')}
          </Link>
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
              active === key
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background hover:bg-muted',
            )}
          >
            {t(label)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : !data?.data?.length ? (
        <div className="py-16 text-center text-muted-foreground">
          <p>{t('noTickets')}</p>
          <p className="mt-1 text-sm">{t('noTicketsHint')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.data.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} href={`/tenant/tickets/${ticket.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
