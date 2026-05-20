'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { TicketCategoryIcon } from './ticket-category-icon';
import type { TicketCategory } from '@/lib/api/types';

const CATEGORIES: TicketCategory[] = ['PLUMBING', 'HEATING', 'INTERNET', 'CLEANING', 'NOISE', 'ELECTRICITY', 'OTHER'];

export function TicketFormStepCategory({
  value,
  onChange,
}: {
  value: TicketCategory | '';
  onChange: (v: TicketCategory) => void;
}) {
  const t = useTranslations('tickets.category');

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={cn(
            'flex min-h-[72px] flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-colors',
            value === cat
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-background hover:border-primary/50 hover:bg-muted',
          )}
        >
          <TicketCategoryIcon category={cat} className="h-6 w-6" />
          {t(cat)}
        </button>
      ))}
    </div>
  );
}
