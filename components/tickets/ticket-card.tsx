'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TicketStatusBadge } from './ticket-status-badge';
import { TicketPriorityBadge } from './ticket-priority-badge';
import { TicketCategoryIcon } from './ticket-category-icon';
import { cn } from '@/lib/utils';
import type { Ticket } from '@/lib/api/types';

function ticketAge(createdAt: string): string {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
  return days === 0 ? 'today' : `${days}d ago`;
}

export function TicketCard({ ticket, href }: { ticket: Ticket; href: string }) {
  const t = useTranslations('tickets');

  return (
    <Link href={href}>
      <Card className={cn('cursor-pointer transition-shadow hover:shadow-md', ticket.isEmergency && 'border-red-400')}>
        {ticket.isEmergency && (
          <div className="flex items-center gap-1.5 rounded-t-lg bg-red-500 px-3 py-1 text-xs font-bold text-white">
            <AlertTriangle className="h-3 w-3" />
            {t('emergency').toUpperCase()}
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 rounded-md bg-muted p-1.5 shrink-0">
                <TicketCategoryIcon category={ticket.category} className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{ticket.ticketNumber}</div>
                <div className="font-medium leading-snug truncate">{ticket.title}</div>
                {ticket.tenant && (
                  <div className="mt-0.5 text-xs text-muted-foreground">{ticket.tenant.name}</div>
                )}
                {ticket.unit && (
                  <div className="text-xs text-muted-foreground">
                    Unit {ticket.unit.unitNumber}
                    {ticket.unit.property && ` · ${ticket.unit.property.name}`}
                  </div>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <TicketStatusBadge status={ticket.status} label={t(`status.${ticket.status}`)} />
              <TicketPriorityBadge priority={ticket.priority} label={t(`priority.${ticket.priority}`)} />
              <span className="text-xs text-muted-foreground">{ticketAge(ticket.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
