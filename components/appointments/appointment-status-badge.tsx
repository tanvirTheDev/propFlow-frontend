'use client';

import { cn } from '@/lib/utils';
import type { AppointmentStatus } from '@/lib/api/types';

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

export function AppointmentStatusBadge({ status, label }: { status: AppointmentStatus; label: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_STYLES[status])}>
      {label}
    </span>
  );
}
