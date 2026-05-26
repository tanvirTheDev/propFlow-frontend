'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Plus, Ticket } from 'lucide-react';
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
    <div className="space-y-4">
      {/* ── Compact gradient page header ─────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-5 py-4 text-white shadow-md shadow-purple-500/20">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-16 h-20 w-20 rounded-full bg-fuchsia-400/20 blur-xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black leading-tight">{t('myTickets')}</h1>
              <p className="text-xs text-purple-200">{t('subtitle')}</p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="h-9 gap-1.5 rounded-xl border-white/40 bg-white font-semibold text-purple-700 shadow-lg hover:bg-white/90 hover:scale-105 active:scale-95 transition-all"
          >
            <Link href="/tenant/tickets/new">
              <Plus className="h-4 w-4" />
              {t('newTicket')}
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Filter pills ─────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all',
              active === key
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                : 'border border-border/60 bg-white text-muted-foreground hover:bg-muted/60 shadow-sm',
            )}
          >
            {t(label)}
          </button>
        ))}
      </div>

      {/* ── Ticket list ───────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : !data?.data?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white py-20 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Ticket className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">{t('noTickets')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('noTicketsHint')}</p>
          <Button className="mt-5" asChild>
            <Link href="/tenant/tickets/new">
              <Plus className="mr-1.5 h-4 w-4" />
              {t('newTicket')}
            </Link>
          </Button>
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
