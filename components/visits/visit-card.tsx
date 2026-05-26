'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { Home, Calendar, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCancelVisit, useCompleteVisit } from '@/lib/hooks/use-visits';
import type { LandlordVisit } from '@/lib/api/types';

const STATUS_STYLES: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
};

const BORDER_STYLES: Record<string, string> = {
  SCHEDULED: 'border-purple-300',
  COMPLETED: 'border-green-300',
  CANCELLED: 'border-gray-200',
};

interface Props {
  visit: LandlordVisit;
  onEdit?: () => void;
}

export function VisitCard({ visit, onEdit }: Props) {
  const t = useTranslations('visits');
  const locale = useLocale();
  const dateLocale = locale === 'de' ? de : enUS;
  const [cancelling, setCancelling] = useState(false);

  const { mutate: complete, isPending: completing } = useCompleteVisit(visit.id);
  const { mutate: cancel, isPending: cancelPending } = useCancelVisit(visit.id);

  const scheduled = new Date(visit.scheduledAt);
  const dateStr = format(scheduled, 'EEEE, dd MMM yyyy', { locale: dateLocale });
  const timeStr = format(scheduled, 'HH:mm');
  const isScheduled = visit.status === 'SCHEDULED';

  const unitLabels = visit.units
    .map((u) => (u.unit ? `${u.unit.unitNumber}` : ''))
    .filter(Boolean)
    .join(', ');

  const notifiedTenants = visit.units
    .filter((u) => u.notifyTenant && u.tenant)
    .map((u) => u.tenant!.name)
    .join(', ');

  return (
    <div className={`rounded-xl border ${BORDER_STYLES[visit.status]} p-4 space-y-3`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <Home className="mt-0.5 h-4 w-4 text-purple-500 shrink-0" />
          <div>
            <p className="font-semibold leading-tight">{visit.property.name}</p>
            <p className="text-xs text-muted-foreground">
              {visit.property.street}, {visit.property.city}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={STATUS_STYLES[visit.status]}>
          {t(`status.${visit.status}`)}
        </Badge>
      </div>

      {/* Date & time */}
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {dateStr}
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {timeStr} · {visit.durationMin} min
        </span>
      </div>

      {/* Reason */}
      <p className="text-sm font-medium">{t(`reasons.${visit.reason}`)}</p>

      {/* Units */}
      {unitLabels && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {t('detail.units')}: {unitLabels}
          {notifiedTenants && ` · ${t('detail.notified')}: ${notifiedTenants}`}
        </div>
      )}

      {/* Actions */}
      {isScheduled && (
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="text-green-700 border-green-300 hover:bg-green-50"
            onClick={() => complete(undefined)}
            disabled={completing}
          >
            {t('detail.markComplete')}
          </Button>
          {onEdit && (
            <Button size="sm" variant="outline" onClick={onEdit}>
              {t('detail.edit')}
            </Button>
          )}
          {!cancelling ? (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/5"
              onClick={() => setCancelling(true)}
            >
              {t('detail.cancel')}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => cancel(undefined, { onSuccess: () => setCancelling(false) })}
              disabled={cancelPending}
            >
              {cancelPending ? '...' : t('form.confirmCancel')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
