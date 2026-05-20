'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppointmentCard } from './appointment-card';
import { AppointmentForm } from './appointment-form';
import { AppointmentConflictWarning } from './appointment-conflict-warning';
import { useCreateAppointment } from '@/lib/hooks/use-appointments';
import { useAuthStore } from '@/lib/stores/auth.store';
import type { Appointment } from '@/lib/api/types';

interface Props {
  ticketId: string;
  appointments: Appointment[];
}

export function TicketAppointmentsSection({ ticketId, appointments }: Props) {
  const t = useTranslations('appointments');
  const user = useAuthStore((s) => s.user);
  const isLandlord = user?.role === 'LANDLORD';
  const [showForm, setShowForm] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const { mutate: create, isPending } = useCreateAppointment(ticketId);

  const scheduled = appointments.filter((a) => a.status === 'SCHEDULED');
  const past = appointments.filter((a) => a.status !== 'SCHEDULED');

  return (
    <div className="space-y-3">
      {scheduled.map((appt) => (
        <AppointmentCard key={appt.id} appointment={appt} />
      ))}

      {!showForm && isLandlord && scheduled.length === 0 && (
        <Button variant="outline" className="w-full" onClick={() => setShowForm(true)}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          {t('schedule')}
        </Button>
      )}

      {showForm && isLandlord && (
        <div className="rounded-xl border p-4">
          <h3 className="mb-3 text-sm font-semibold">{t('schedule')}</h3>
          <AppointmentConflictWarning warnings={warnings} />
          <AppointmentForm
            onSubmit={(data) =>
              create(data, {
                onSuccess: (res) => {
                  setWarnings(res.warnings);
                  if (!res.warnings.length) setShowForm(false);
                  toast.success(t('scheduledSuccess'));
                },
                onError: () => toast.error(t('scheduleError')),
              })
            }
            onCancel={() => setShowForm(false)}
            isPending={isPending}
          />
        </div>
      )}

      {past.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
            {t('pastAppointments')} ({past.length})
          </summary>
          <div className="mt-2 space-y-2">
            {past.map((appt) => <AppointmentCard key={appt.id} appointment={appt} />)}
          </div>
        </details>
      )}
    </div>
  );
}
