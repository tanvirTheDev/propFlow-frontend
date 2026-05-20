'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { Calendar, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AppointmentStatusBadge } from './appointment-status-badge';
import { CancelAppointmentDialog } from './cancel-appointment-dialog';
import { AppointmentForm } from './appointment-form';
import { useCompleteAppointment, useCancelAppointment, useUpdateAppointment } from '@/lib/hooks/use-appointments';
import { useAuthStore } from '@/lib/stores/auth.store';
import type { Appointment } from '@/lib/api/types';

interface Props {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: Props) {
  const t = useTranslations('appointments');
  const locale = useLocale();
  const dateLocale = locale === 'de' ? de : enUS;
  const user = useAuthStore((s) => s.user);
  const isLandlord = user?.role === 'LANDLORD';
  const [editing, setEditing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const { mutate: complete, isPending: completing } = useCompleteAppointment(appointment.id);
  const { mutate: cancel, isPending: cancelling2 } = useCancelAppointment(appointment.id);
  const { mutate: update, isPending: updating } = useUpdateAppointment(appointment.id);

  const scheduled = new Date(appointment.scheduledAt);
  const isScheduled = appointment.status === 'SCHEDULED';
  const dateStr = format(scheduled, 'EEEE, dd MMM yyyy', { locale: dateLocale });
  const timeStr = format(scheduled, 'HH:mm', { locale: dateLocale });
  const relativeStr = isPast(scheduled) ? '' : formatDistanceToNow(scheduled, { addSuffix: true, locale: dateLocale });

  const borderColor =
    appointment.status === 'SCHEDULED' ? 'border-blue-300' :
    appointment.status === 'COMPLETED' ? 'border-green-300' : 'border-gray-200';

  if (editing) {
    return (
      <div className={`rounded-xl border ${borderColor} p-4`}>
        <h3 className="mb-3 text-sm font-semibold">{t('edit')}</h3>
        <AppointmentForm
          defaultValues={{ scheduledAt: appointment.scheduledAt, durationMin: appointment.durationMin, note: appointment.note ?? '' }}
          onSubmit={(data) => update(data, { onSuccess: () => setEditing(false), onError: () => toast.error(t('editError')) })}
          onCancel={() => setEditing(false)}
          isPending={updating}
        />
      </div>
    );
  }

  return (
    <>
      <div className={`rounded-xl border ${borderColor} p-4 space-y-3`}>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {dateStr}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {timeStr} · {appointment.durationMin} min
              {relativeStr && <span className="text-xs">({relativeStr})</span>}
            </div>
          </div>
          <AppointmentStatusBadge status={appointment.status} label={t(`status.${appointment.status}`)} />
        </div>

        {appointment.note && <p className="text-sm text-muted-foreground">{appointment.note}</p>}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          {appointment.createdBy.name}
        </div>

        {isScheduled && (
          <div className="flex gap-2 pt-1">
            {isLandlord && (
              <>
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>{t('edit')}</Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-700 border-green-300 hover:bg-green-50"
                  onClick={() => complete(undefined, { onSuccess: () => toast.success(t('completedSuccess')), onError: () => toast.error(t('completeError')) })}
                  disabled={completing}
                >
                  {t('complete')}
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => setCancelling(true)}>
              {t('cancel')}
            </Button>
          </div>
        )}
      </div>

      <CancelAppointmentDialog
        open={cancelling}
        onClose={() => setCancelling(false)}
        onConfirm={(reason) => cancel(reason, { onSuccess: () => { setCancelling(false); toast.success(t('cancelledSuccess')); }, onError: () => toast.error(t('cancelError')) })}
        isPending={cancelling2}
      />
    </>
  );
}
