'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, MapPin, User } from 'lucide-react';
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

export default function LandlordTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('tickets');
  const tDetail = useTranslations('tickets.detail');
  const { data: ticket, isLoading } = useTicket(id);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-20" /><Skeleton className="h-60" /></div>;
  if (!ticket) return <p className="text-muted-foreground">Ticket not found.</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/landlord/tickets"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground">{ticket.ticketNumber}</div>
          <h1 className="text-lg font-bold">{ticket.title}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TicketStatusDropdown ticketId={ticket.id} current={ticket.status} />
          <TicketPriorityBadge priority={ticket.priority} label={t(`priority.${ticket.priority}`)} />
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">{tDetail('tabs.details')}</TabsTrigger>
          <TabsTrigger value="notes">{tDetail('tabs.notes')}</TabsTrigger>
          <TabsTrigger value="history">{tDetail('tabs.history')}</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-5 pt-2">
          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <TicketCategoryIcon category={ticket.category} className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{t(`category.${ticket.category}`)}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {ticket.photos.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">{tDetail('photos')}</h3>
              <PhotoGallery photos={ticket.photos} />
            </div>
          )}

          {ticket.tenant && (
            <div className="rounded-xl border p-4">
              <h3 className="mb-2 text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                {tDetail('submittedBy')}
              </h3>
              <p className="text-sm font-medium">{ticket.tenant.name}</p>
              <p className="text-xs text-muted-foreground">{ticket.tenant.email}</p>
              {ticket.tenant.phone && <p className="text-xs text-muted-foreground">{ticket.tenant.phone}</p>}
            </div>
          )}

          {ticket.unit && (
            <div className="rounded-xl border p-4">
              <h3 className="mb-2 text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {tDetail('unit')}
              </h3>
              <p className="text-sm font-medium">Unit {ticket.unit.unitNumber}</p>
              {ticket.unit.property && (
                <>
                  <p className="text-xs text-muted-foreground">{ticket.unit.property.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {ticket.unit.property.street}, {ticket.unit.property.city}
                  </p>
                  <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-xs" asChild>
                    <Link href={`/units/${ticket.unit.id}/ticket-history`}>
                      {tDetail('viewRepairHistory')}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-semibold">{tDetail('chat')}</h3>
            <ChatThread ticketId={ticket.id} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">{tDetail('appointments')}</h3>
            <TicketAppointmentsSection ticketId={ticket.id} appointments={ticket.appointments ?? []} />
          </div>
        </TabsContent>

        <TabsContent value="notes" className="pt-2">
          <TicketNotesSection ticketId={ticket.id} />
        </TabsContent>

        <TabsContent value="history" className="pt-2 space-y-4">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Created: {format(new Date(ticket.createdAt), 'dd MMM yyyy, HH:mm')}</p>
            <p>Last activity: {format(new Date(ticket.lastActivity), 'dd MMM yyyy, HH:mm')}</p>
            {ticket.closedAt && <p>Closed: {format(new Date(ticket.closedAt), 'dd MMM yyyy, HH:mm')}</p>}
          </div>
          {ticket.statusHistory && ticket.statusHistory.length > 0 && (
            <TicketStatusTimeline history={ticket.statusHistory} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
