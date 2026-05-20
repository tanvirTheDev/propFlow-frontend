import { cn } from '@/lib/utils';
import type { TicketStatus } from '@/lib/api/types';

const styles: Record<TicketStatus, string> = {
  OPEN: 'bg-amber-100 text-amber-800 border-amber-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  FIXED: 'bg-green-100 text-green-800 border-green-200',
  CLOSED: 'bg-gray-100 text-gray-600 border-gray-200',
};

export function TicketStatusBadge({ status, label }: { status: TicketStatus; label: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold', styles[status])}>
      {label}
    </span>
  );
}
