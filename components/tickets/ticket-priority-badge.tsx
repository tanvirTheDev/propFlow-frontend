import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TicketPriority } from '@/lib/api/types';

const styles: Record<TicketPriority, string> = {
  URGENT: 'bg-red-100 text-red-700 border-red-200',
  NORMAL: 'bg-gray-100 text-gray-600 border-gray-200',
  LOW: 'bg-slate-100 text-slate-500 border-slate-200',
};

export function TicketPriorityBadge({ priority, label }: { priority: TicketPriority; label: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold', styles[priority])}>
      {priority === 'URGENT' && <Bell className="h-3 w-3" />}
      {label}
    </span>
  );
}
