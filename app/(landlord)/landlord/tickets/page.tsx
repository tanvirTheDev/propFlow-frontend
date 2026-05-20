'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TicketCard } from '@/components/tickets/ticket-card';
import { useTickets } from '@/lib/hooks/use-tickets';
import type { TicketStatus, TicketPriority } from '@/lib/api/types';

export default function LandlordTicketsPage() {
  const t = useTranslations('tickets');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TicketStatus | 'ALL'>('ALL');
  const [priority, setPriority] = useState<TicketPriority | 'ALL'>('ALL');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [sort, setSort] = useState<'newest' | 'oldest' | 'priority' | 'last_activity'>('newest');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const params = {
    ...(search && { search }),
    ...(status !== 'ALL' && { status }),
    ...(priority !== 'ALL' && { priority }),
    ...(emergencyOnly && { isEmergency: true }),
    sort,
    page,
    limit: 20,
  };

  const { data, isLoading } = useTickets(params);
  const { data: emergencyData } = useTickets({ isEmergency: true, status: 'OPEN' as TicketStatus });

  const hasEmergencies = (emergencyData?.data?.length ?? 0) > 0;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {hasEmergencies && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3">
          <div className="mb-2 flex items-center gap-2 font-bold text-red-700">
            <AlertTriangle className="h-4 w-4" />
            {t('emergencyBanner')} ({emergencyData?.data.length})
          </div>
          <div className="space-y-2">
            {emergencyData?.data.slice(0, 3).map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} href={`/landlord/tickets/${ticket.id}`} />
            ))}
          </div>
        </div>
      )}

      {/* Search + filter toggle row */}
      <div className="mb-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={t('filters.search')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-label={t('filters.filter')}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter controls — always visible on desktop, collapsible on mobile */}
      <div className={`mb-4 flex flex-wrap gap-2 ${filtersOpen ? 'flex' : 'hidden md:flex'}`}>
        <Select value={status} onValueChange={(v) => { setStatus(v as TicketStatus | 'ALL'); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('filters.all')}</SelectItem>
            <SelectItem value="OPEN">{t('filters.open')}</SelectItem>
            <SelectItem value="IN_PROGRESS">{t('filters.inProgress')}</SelectItem>
            <SelectItem value="FIXED">{t('filters.fixed')}</SelectItem>
            <SelectItem value="CLOSED">{t('filters.closed')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={(v) => { setPriority(v as TicketPriority | 'ALL'); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('filters.all')}</SelectItem>
            <SelectItem value="URGENT">{t('priority.URGENT')}</SelectItem>
            <SelectItem value="NORMAL">{t('priority.NORMAL')}</SelectItem>
            <SelectItem value="LOW">{t('priority.LOW')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('filters.sortNewest')}</SelectItem>
            <SelectItem value="oldest">{t('filters.sortOldest')}</SelectItem>
            <SelectItem value="priority">{t('filters.sortPriority')}</SelectItem>
            <SelectItem value="last_activity">{t('filters.sortActivity')}</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={emergencyOnly ? 'destructive' : 'outline'}
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => { setEmergencyOnly((v) => !v); setPage(1); }}
        >
          <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
          {t('filters.emergency')}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : !data?.data?.length ? (
        <div className="py-16 text-center text-muted-foreground">{t('noTickets')}</div>
      ) : (
        <>
          <div className="space-y-3">
            {data.data.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} href={`/landlord/tickets/${ticket.id}`} />
            ))}
          </div>
          {data.total > 20 && (
            <div className="mt-4 flex justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="self-center text-sm text-muted-foreground">
                Page {page} of {Math.ceil(data.total / 20)}
              </span>
              <Button variant="outline" size="sm" disabled={page >= Math.ceil(data.total / 20)} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
