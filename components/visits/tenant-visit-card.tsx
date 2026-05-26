'use client';

import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { CalendarDays, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { LandlordVisit } from '@/lib/api/types';

interface Props {
  visit: LandlordVisit;
}

export function TenantVisitCard({ visit }: Props) {
  const t = useTranslations('visits');
  const locale = useLocale();
  const dateLocale = locale === 'de' ? de : enUS;

  const scheduled = new Date(visit.scheduledAt);
  const dateStr = format(scheduled, 'EEEE, dd MMMM yyyy', { locale: dateLocale });
  const startTime = format(scheduled, 'HH:mm');
  const endTime = format(
    new Date(scheduled.getTime() + visit.durationMin * 60 * 1000),
    'HH:mm',
  );

  // Find tenant's own unit entry if it exists
  const myUnitEntry = visit.units[0];
  const unitLabel = myUnitEntry?.unit?.unitNumber
    ? `Unit ${myUnitEntry.unit.unitNumber}`
    : '';

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-purple-100 p-2 shrink-0">
            <CalendarDays className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
              {t('tenant.title')}
            </p>
            <p className="mt-0.5 font-semibold">
              {visit.property.name}
              {unitLabel && ` · ${unitLabel}`}
            </p>
            <p className="text-sm text-purple-700">{dateStr}</p>
            <p className="text-sm text-purple-700">
              {startTime} – {endTime}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(`reasons.${visit.reason}`)}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-800">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>{t('tenant.accessNote')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
