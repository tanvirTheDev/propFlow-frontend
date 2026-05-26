'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import { TicketStatusBadge } from './ticket-status-badge';
import { TicketPriorityBadge } from './ticket-priority-badge';
import { TicketCategoryIcon } from './ticket-category-icon';
import { cn } from '@/lib/utils';
import type { Ticket } from '@/lib/api/types';

function ticketAge(createdAt: string): string {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
  return days === 0 ? 'today' : `${days}d ago`;
}

/* Priority → left bar color */
const priorityBar: Record<string, string> = {
  URGENT: 'bg-red-500',
  NORMAL: 'bg-indigo-500',
  LOW:    'bg-slate-400',
};

/* Priority → icon background */
const priorityIconBg: Record<string, string> = {
  URGENT: 'bg-red-100',
  NORMAL: 'bg-indigo-100',
  LOW:    'bg-slate-100',
};

const priorityIconColor: Record<string, string> = {
  URGENT: 'text-red-600',
  NORMAL: 'text-indigo-600',
  LOW:    'text-slate-500',
};

export function TicketCard({ ticket, href }: { ticket: Ticket; href: string }) {
  const t = useTranslations('tickets');

  const barColor   = priorityBar[ticket.priority]    ?? 'bg-slate-400';
  const iconBg     = priorityIconBg[ticket.priority]  ?? 'bg-slate-100';
  const iconColor  = priorityIconColor[ticket.priority] ?? 'text-slate-500';

  return (
    <Link href={href}>
      <div
        className={cn(
          'card-hover group relative overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm cursor-pointer',
          ticket.isEmergency && 'border-red-300',
        )}
      >
        {/* Emergency top banner */}
        {ticket.isEmergency && (
          <div className="flex items-center gap-1.5 bg-linear-to-r from-red-500 to-rose-600 px-4 py-1.5 text-xs font-bold text-white">
            <AlertTriangle className="h-3 w-3" />
            {t('emergency').toUpperCase()}
          </div>
        )}

        <div className="flex">
          {/* Priority left bar */}
          <div className={cn('w-1 shrink-0 self-stretch rounded-l-2xl', barColor, ticket.isEmergency && 'rounded-tl-none')} />

          {/* Content */}
          <div className="flex flex-1 items-start gap-3 p-4">
            {/* Category icon */}
            <div className={cn('mt-0.5 shrink-0 rounded-xl p-2', iconBg)}>
              <TicketCategoryIcon category={ticket.category} className={cn('h-4 w-4', iconColor)} />
            </div>

            {/* Text info */}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-muted-foreground">{ticket.ticketNumber}</p>
              <p className="font-semibold leading-snug truncate text-foreground group-hover:text-primary transition-colors">
                {ticket.title}
              </p>
              {ticket.tenant && (
                <p className="mt-0.5 text-xs text-muted-foreground">{ticket.tenant.name}</p>
              )}
              {ticket.unit && (
                <p className="text-xs text-muted-foreground">
                  Unit {ticket.unit.unitNumber}
                  {ticket.unit.property && ` · ${ticket.unit.property.name}`}
                </p>
              )}
            </div>

            {/* Right side: badges + age */}
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <TicketStatusBadge status={ticket.status} label={t(`status.${ticket.status}`)} />
              <TicketPriorityBadge priority={ticket.priority} label={t(`priority.${ticket.priority}`)} />
              <span className="text-[11px] text-muted-foreground">{ticketAge(ticket.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
