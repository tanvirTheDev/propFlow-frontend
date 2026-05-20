'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateTicketStatus } from '@/lib/hooks/use-tickets';
import type { TicketStatus } from '@/lib/api/types';

const ALLOWED: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ['IN_PROGRESS', 'CLOSED'],
  IN_PROGRESS: ['FIXED', 'OPEN', 'CLOSED'],
  FIXED: ['CLOSED', 'IN_PROGRESS'],
  CLOSED: [],
};

const ALL_STATUSES: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'FIXED', 'CLOSED'];

export function TicketStatusDropdown({ ticketId, current }: { ticketId: string; current: TicketStatus }) {
  const t = useTranslations('tickets.status');
  const tCommon = useTranslations('common');
  const { mutate, isPending } = useUpdateTicketStatus();

  const allowed = ALLOWED[current];

  if (!allowed.length) return <span className="text-sm text-muted-foreground">{t(current)}</span>;

  return (
    <Select
      value={current}
      disabled={isPending}
      onValueChange={(val) =>
        mutate(
          { id: ticketId, status: val },
          {
            onSuccess: () => toast.success('Status updated'),
            onError: () => toast.error(tCommon('error')),
          },
        )
      }
    >
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ALL_STATUSES.filter((s) => s === current || allowed.includes(s)).map((s) => (
          <SelectItem key={s} value={s} disabled={s !== current && !allowed.includes(s)}>
            {t(s)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
