'use client';

import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { CalendarDays, Clock, MapPin, AlertTriangle } from 'lucide-react';
import type { LandlordVisit } from '@/lib/api/types';

const REASON_ICONS: Record<string, string> = {
  INSPECTION:  '🔍',
  MAINTENANCE: '🔧',
  REPAIR:      '🛠️',
  EMERGENCY:   '🚨',
  SHOWING:     '👀',
  OTHER:       '📋',
};

interface Props {
  visit: LandlordVisit;
}

export function TenantVisitCard({ visit }: Props) {
  const t = useTranslations('visits');
  const locale = useLocale();
  const dateLocale = locale === 'de' ? de : enUS;

  const scheduled = new Date(visit.scheduledAt);
  const endTime   = new Date(scheduled.getTime() + visit.durationMin * 60_000);
  const myUnit    = visit.units[0];
  const unitLabel = myUnit?.unit?.unitNumber ? `Unit ${myUnit.unit.unitNumber}` : '';

  return (
    <div className="card-hover overflow-hidden rounded-2xl border border-violet-200/80 bg-white shadow-sm">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-linear-to-r from-violet-500 to-fuchsia-500" />

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Reason icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-100 to-fuchsia-100 text-lg">
            {REASON_ICONS[visit.reason] ?? '📋'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
                  {t('tenant.title')}
                </p>
                <p className="mt-0.5 font-bold truncate">
                  {visit.property.name}
                  {unitLabel && <span className="font-normal text-muted-foreground"> · {unitLabel}</span>}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                {t(`reasons.${visit.reason}`)}
              </span>
            </div>

            <div className="mt-2 grid gap-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3 shrink-0 text-violet-400" />
                {format(scheduled, 'EEEE, dd MMMM yyyy', { locale: dateLocale })}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 shrink-0 text-violet-400" />
                {format(scheduled, 'HH:mm')} – {format(endTime, 'HH:mm')}
                <span className="text-muted-foreground/50">({visit.durationMin} min)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0 text-violet-400" />
                <span className="truncate">{visit.property.street}, {visit.property.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Access notice */}
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200/80 bg-amber-50 p-2.5">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
          <p className="text-xs leading-relaxed text-amber-800">{t('tenant.accessNote')}</p>
        </div>
      </div>
    </div>
  );
}
