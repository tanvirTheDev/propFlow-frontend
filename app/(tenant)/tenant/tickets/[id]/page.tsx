'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, MapPin, Calendar, Clock, MessageSquare, Image, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketStatusBadge } from '@/components/tickets/ticket-status-badge';
import { TicketPriorityBadge } from '@/components/tickets/ticket-priority-badge';
import { TicketCategoryIcon } from '@/components/tickets/ticket-category-icon';
import { PhotoGallery } from '@/components/tickets/photo-gallery';
import { TicketStatusTimeline } from '@/components/tickets/ticket-status-timeline';
import { useTicket } from '@/lib/hooks/use-tickets';
import { ChatThread } from '@/components/chat/chat-thread';
import { TicketAppointmentsSection } from '@/components/appointments/ticket-appointments-section';

const PRIORITY_GRADIENT: Record<string, string> = {
  URGENT: 'from-red-500 to-rose-600',
  NORMAL: 'from-violet-600 to-fuchsia-600',
  LOW:    'from-slate-500 to-slate-700',
};

export default function TenantTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('tickets');
  const tDetail = useTranslations('tickets.detail');
  const { data: ticket, isLoading } = useTicket(id);

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-56 rounded-2xl" />
      <Skeleton className="h-40 rounded-2xl" />
    </div>
  );
  if (!ticket) return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white py-20 text-center shadow-sm">
      <p className="font-semibold text-muted-foreground">Ticket not found.</p>
      <Button variant="outline" className="mt-4 rounded-xl" asChild>
        <Link href="/tenant/tickets"><ArrowLeft className="mr-2 h-4 w-4" /> Back to tickets</Link>
      </Button>
    </div>
  );

  const grad = PRIORITY_GRADIENT[ticket.priority] ?? PRIORITY_GRADIENT.NORMAL;

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-4">

      {/* ── Hero header ─────────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-2xl bg-linear-to-r ${grad} p-5 text-white shadow-lg`}>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          {/* Back + ticket number */}
          <div className="mb-3 flex items-center gap-2">
            <Link href="/tenant/tickets"
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-2.5 py-1.5 text-xs font-semibold backdrop-blur-sm hover:bg-white/25 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-mono font-semibold backdrop-blur-sm">
              {ticket.ticketNumber}
            </span>
            {ticket.isEmergency && (
              <span className="rounded-full bg-red-300/30 px-2.5 py-1 text-[11px] font-bold text-red-100 border border-red-300/40">
                🚨 EMERGENCY
              </span>
            )}
          </div>

          {/* Category + title + badges */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <TicketCategoryIcon category={ticket.category} className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                  {t(`category.${ticket.category}`)}
                </p>
                <h1 className="mt-0.5 text-xl font-black leading-tight truncate">{ticket.title}</h1>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <TicketStatusBadge status={ticket.status} label={t(`status.${ticket.status}`)} />
              <TicketPriorityBadge priority={ticket.priority} label={t(`priority.${ticket.priority}`)} />
            </div>
          </div>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/70">
            {ticket.unit && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Unit {ticket.unit.unitNumber}
                {ticket.unit.property && ` · ${ticket.unit.property.name}`}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(ticket.createdAt), 'dd MMM yyyy')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Description ──────────────────────────────────── */}
      <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</p>
        <p className="text-sm leading-relaxed">{ticket.description}</p>
      </div>

      {/* ── Photos ───────────────────────────────────────── */}
      {ticket.photos.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Image className="h-3.5 w-3.5" /> {tDetail('photos')}
          </p>
          <PhotoGallery photos={ticket.photos} />
        </div>
      )}

      {/* ── Status history ────────────────────────────────── */}
      {(ticket.statusHistory?.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Activity className="h-3.5 w-3.5" /> {tDetail('statusHistory')}
          </p>
          <TicketStatusTimeline history={ticket.statusHistory!} />
        </div>
      )}

      {/* ── Chat ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" /> {tDetail('chat')}
        </p>
        <ChatThread ticketId={ticket.id} />
      </div>

      {/* ── Appointments ─────────────────────────────────── */}
      {(ticket.appointments?.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> {tDetail('appointments')}
          </p>
          <TicketAppointmentsSection ticketId={ticket.id} appointments={ticket.appointments!} />
        </div>
      )}

      {/* ── Created date ─────────────────────────────────── */}
      <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        Last updated {format(new Date(ticket.lastActivity), 'dd MMM yyyy, HH:mm')}
      </div>
    </div>
  );
}
