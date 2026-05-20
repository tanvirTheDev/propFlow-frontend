'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, MapPin } from 'lucide-react';
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

export default function TenantTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('tickets');
  const tDetail = useTranslations('tickets.detail');
  const { data: ticket, isLoading } = useTicket(id);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-20" /><Skeleton className="h-40" /></div>;
  if (!ticket) return <p className="text-muted-foreground">Ticket not found.</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tenant/tickets"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground">{ticket.ticketNumber}</div>
          <h1 className="text-lg font-bold truncate">{ticket.title}</h1>
        </div>
        <div className="flex gap-2 shrink-0">
          <TicketStatusBadge status={ticket.status} label={t(`status.${ticket.status}`)} />
          <TicketPriorityBadge priority={ticket.priority} label={t(`priority.${ticket.priority}`)} />
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <TicketCategoryIcon category={ticket.category} className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{t(`category.${ticket.category}`)}</span>
        </div>
        <p className="text-sm">{ticket.description}</p>
        {ticket.unit && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              Unit {ticket.unit.unitNumber}
              {ticket.unit.property && ` · ${ticket.unit.property.name}, ${ticket.unit.property.city}`}
            </span>
          </div>
        )}
      </div>

      {ticket.photos.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold">{tDetail('photos')}</h2>
          <PhotoGallery photos={ticket.photos} />
        </div>
      )}

      {ticket.statusHistory && ticket.statusHistory.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold">{tDetail('statusHistory')}</h2>
          <TicketStatusTimeline history={ticket.statusHistory} />
        </div>
      )}

      <div>
        <h2 className="mb-3 font-semibold">{tDetail('chat')}</h2>
        <ChatThread ticketId={ticket.id} />
      </div>
      {(ticket.appointments?.length ?? 0) > 0 && (
        <div>
          <h2 className="mb-3 font-semibold">{tDetail('appointments')}</h2>
          <TicketAppointmentsSection ticketId={ticket.id} appointments={ticket.appointments ?? []} />
        </div>
      )}
    </div>
  );
}
