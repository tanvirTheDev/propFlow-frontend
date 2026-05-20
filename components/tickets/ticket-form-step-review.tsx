'use client';

import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import { TicketCategoryIcon } from './ticket-category-icon';
import { TicketPriorityBadge } from './ticket-priority-badge';
import type { TicketCategory, TicketPriority } from '@/lib/api/types';

interface Props {
  category: TicketCategory;
  priority: TicketPriority;
  title: string;
  description: string;
  photos: File[];
  isEmergency: boolean;
}

export function TicketFormStepReview({ category, priority, title, description, photos, isEmergency }: Props) {
  const t = useTranslations('tickets');

  return (
    <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
      {isEmergency && (
        <div className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">
          <AlertTriangle className="h-4 w-4" />
          {t('emergency')}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-background p-2 ring-1 ring-border">
          <TicketCategoryIcon category={category} className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t(`category.${category}`)}</p>
          <p className="font-semibold">{title}</p>
        </div>
        <div className="ml-auto">
          <TicketPriorityBadge priority={priority} label={t(`priority.${priority}`)} />
        </div>
      </div>

      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{description}</p>

      {photos.length > 0 && (
        <div className="flex gap-2">
          {photos.map((f, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={URL.createObjectURL(f)} alt="" className="h-16 w-16 rounded-md object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
