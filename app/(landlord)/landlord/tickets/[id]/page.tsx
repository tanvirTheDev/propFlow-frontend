'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, MapPin, User, Clock, Calendar, MessageSquare, FileText, History } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketCategoryIcon } from '@/components/tickets/ticket-category-icon';
import { TicketStatusDropdown } from '@/components/tickets/ticket-status-dropdown';
import { TicketPriorityBadge } from '@/components/tickets/ticket-priority-badge';
import { PhotoGallery } from '@/components/tickets/photo-gallery';
import { TicketStatusTimeline } from '@/components/tickets/ticket-status-timeline';
import { TicketNotesSection } from '@/components/tickets/ticket-notes-section';
import { useTicket } from '@/lib/hooks/use-tickets';
import { ChatThread } from '@/components/chat/chat-thread';
import { TicketAppointmentsSection } from '@/components/appointments/ticket-appointments-section';

const PRIORITY_GRADIENT: Record<string, string> = {
  URGENT: 'from-red-500 to-rose-600',
  NORMAL: 'from-blue-500 to-indigo-600',
  LOW:    'from-slate-400 to-slate-600',
};

export default function LandlordTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('tickets');
  const tDetail = useTranslations('tickets.detail');
  const { data: ticket, isLoading } = useTicket(id);

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-10 rounded-xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
  if (!ticket) return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white py-20 text-center shadow-sm">
      <p className="font-semibold text-muted-foreground">Ticket not found.</p>
      <Button variant="outline" className="mt-4 rounded-xl" asChild>
        <Link href="/landlord/tickets"><ArrowLeft className="mr-2 h-4 w-4" /> Back to tickets</Link>
      </Button>
    </div>
  );

  const grad = PRIORITY_GRADIENT[ticket.priority] ?? PRIORITY_GRADIENT.NORMAL;

  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-4">

      {/* ── Hero header ─────────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-2xl bg-linear-to-r ${grad} p-5 text-white shadow-lg`}>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          {/* Back + ticket number row */}
          <div className="mb-3 flex items-center gap-2">
            <Link href="/landlord/tickets"
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

          {/* Title + actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <TicketCategoryIcon category={ticket.category} className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                  {t(`category.${ticket.category}`)}
                </p>
                <h1 className="mt-0.5 text-xl font-black leading-tight">{ticket.title}</h1>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <TicketStatusDropdown ticketId={ticket.id} current={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} label={t(`priority.${ticket.priority}`)} />
            </div>
          </div>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created {format(new Date(ticket.createdAt), 'dd MMM yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last activity {format(new Date(ticket.lastActivity), 'dd MMM yyyy, HH:mm')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────── */}
      <Tabs defaultValue="details">
        <TabsList className="w-full rounded-xl border border-border/60 bg-white p-1 shadow-sm h-auto">
          <TabsTrigger value="details" className="flex-1 gap-1.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
            <FileText className="h-3.5 w-3.5" /> {tDetail('tabs.details')}
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex-1 gap-1.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
            <MessageSquare className="h-3.5 w-3.5" /> {tDetail('tabs.notes')}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 gap-1.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
            <History className="h-3.5 w-3.5" /> {tDetail('tabs.history')}
          </TabsTrigger>
        </TabsList>

        {/* ── Details tab ─────────────────────────────────── */}
        <TabsContent value="details" className="mt-4 space-y-4">

          {/* Description */}
          <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Photos */}
          {ticket.photos.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{tDetail('photos')}</p>
              <PhotoGallery photos={ticket.photos} />
            </div>
          )}

          {/* Tenant info */}
          {ticket.tenant && (
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{tDetail('submittedBy')}</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold">{ticket.tenant.name}</p>
                  <p className="text-xs text-muted-foreground">{ticket.tenant.email}</p>
                  {ticket.tenant.phone && <p className="text-xs text-muted-foreground">{ticket.tenant.phone}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Unit info */}
          {ticket.unit && (
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{tDetail('unit')}</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                  <MapPin className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="font-semibold">Unit {ticket.unit.unitNumber}</p>
                  {ticket.unit.property && (
                    <>
                      <p className="text-xs text-muted-foreground">{ticket.unit.property.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.unit.property.street}, {ticket.unit.property.city}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Chat */}
          <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{tDetail('chat')}</p>
            <ChatThread ticketId={ticket.id} />
          </div>

          {/* Appointments */}
          <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{tDetail('appointments')}</p>
            <TicketAppointmentsSection ticketId={ticket.id} appointments={ticket.appointments ?? []} />
          </div>
        </TabsContent>

        {/* ── Notes tab ──────────────────────────────────── */}
        <TabsContent value="notes" className="mt-4">
          <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
            <TicketNotesSection ticketId={ticket.id} />
          </div>
        </TabsContent>

        {/* ── History tab ────────────────────────────────── */}
        <TabsContent value="history" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Timeline</p>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">{format(new Date(ticket.createdAt), 'dd MMM yyyy, HH:mm')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Last activity:</span>
              <span className="font-medium">{format(new Date(ticket.lastActivity), 'dd MMM yyyy, HH:mm')}</span>
            </div>
            {ticket.closedAt && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-emerald-500" />
                <span className="text-muted-foreground">Closed:</span>
                <span className="font-medium">{format(new Date(ticket.closedAt), 'dd MMM yyyy, HH:mm')}</span>
              </div>
            )}
          </div>
          {ticket.statusHistory && ticket.statusHistory.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status History</p>
              <TicketStatusTimeline history={ticket.statusHistory} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
