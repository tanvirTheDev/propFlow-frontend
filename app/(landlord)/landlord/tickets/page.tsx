'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, Search, SlidersHorizontal, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const totalPages = Math.ceil((data?.total ?? 0) / 20);

  return (
    <div className="space-y-4">
      {/* ── Compact gradient page header ─────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-violet-700 px-5 py-4 text-white shadow-md shadow-indigo-500/20">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-16 h-20 w-20 rounded-full bg-violet-400/20 blur-xl" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black leading-tight">{t('title')}</h1>
              <p className="text-xs text-blue-200">{t('subtitle')}</p>
            </div>
          </div>
          {data?.total != null && (
            <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
              {data.total} total
            </span>
          )}
        </div>
      </div>

      {/* ── Emergency alert ──────────────────────────────── */}
      {hasEmergencies && (
        <div className="overflow-hidden rounded-2xl border-2 border-red-300 bg-linear-to-r from-red-50 to-rose-50 shadow-sm">
          <div className="flex items-center gap-2 bg-linear-to-r from-red-500 to-rose-600 px-4 py-2 text-xs font-bold text-white">
            <AlertTriangle className="h-3.5 w-3.5" />
            {t('emergencyBanner')} ({emergencyData?.data.length})
          </div>
          <div className="space-y-2 p-3">
            {emergencyData?.data.slice(0, 3).map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} href={`/landlord/tickets/${ticket.id}`} />
            ))}
          </div>
        </div>
      )}

      {/* ── Search + filter toggle ────────────────────────── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="rounded-xl pl-9 border-border/60 bg-white shadow-sm focus-visible:ring-primary/30"
            placeholder={t('filters.search')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 rounded-xl border-border/60 bg-white shadow-sm md:hidden"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-label={t('filters.filter')}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* ── Filter controls ───────────────────────────────── */}
      <div className={`flex flex-wrap gap-2 ${filtersOpen ? 'flex' : 'hidden md:flex'}`}>
        <Select value={status} onValueChange={(v) => { setStatus(v as TicketStatus | 'ALL'); setPage(1); }}>
          <SelectTrigger className="w-full rounded-xl border-border/60 bg-white shadow-sm sm:w-36">
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
          <SelectTrigger className="w-full rounded-xl border-border/60 bg-white shadow-sm sm:w-32">
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
          <SelectTrigger className="w-full rounded-xl border-border/60 bg-white shadow-sm sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('filters.sortNewest')}</SelectItem>
            <SelectItem value="oldest">{t('filters.sortOldest')}</SelectItem>
            <SelectItem value="priority">{t('filters.sortPriority')}</SelectItem>
            <SelectItem value="last_activity">{t('filters.sortActivity')}</SelectItem>
          </SelectContent>
        </Select>
        <button
          onClick={() => { setEmergencyOnly((v) => !v); setPage(1); }}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors w-full sm:w-auto ${
            emergencyOnly
              ? 'bg-red-500 text-white shadow-sm'
              : 'border border-border/60 bg-white text-muted-foreground hover:bg-muted/60 shadow-sm'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          {t('filters.emergency')}
        </button>
      </div>

      {/* ── Ticket list ───────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : !data?.data?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Ticket className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">{t('noTickets')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data.data.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} href={`/landlord/tickets/${ticket.id}`} />
            ))}
          </div>

          {/* Pagination */}
          {(data.total ?? 0) > 20 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/60 bg-white shadow-sm gap-1.5"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/60 bg-white shadow-sm gap-1.5"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
