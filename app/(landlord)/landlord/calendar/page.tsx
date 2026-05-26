'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CalendarView } from '@/components/appointments/calendar-view';
import { AppointmentList } from '@/components/appointments/appointment-list';
import { VisitForm } from '@/components/visits/visit-form';
import { VisitDetailSheet } from '@/components/visits/visit-detail-sheet';
import { VisitCard } from '@/components/visits/visit-card';
import { useAppointments } from '@/lib/hooks/use-appointments';
import { useVisits } from '@/lib/hooks/use-visits';
import type { LandlordVisit } from '@/lib/api/types';

export default function LandlordCalendarPage() {
  const t = useTranslations('calendar');
  const tVisits = useTranslations('visits');
  const { data: appointments = [], isLoading: loadingAppts } = useAppointments();
  const { data: visits = [], isLoading: loadingVisits } = useVisits();

  const [visitFormOpen, setVisitFormOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<LandlordVisit | null>(null);

  const isLoading = loadingAppts || loadingVisits;

  const todayAppts = appointments.filter((a) => {
    const d = new Date(a.scheduledAt);
    const now = new Date();
    return d.toDateString() === now.toDateString() && a.status === 'SCHEDULED';
  });

  const todayVisits = visits.filter((v) => {
    const d = new Date(v.scheduledAt);
    const now = new Date();
    return d.toDateString() === now.toDateString() && v.status === 'SCHEDULED';
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <Button onClick={() => setVisitFormOpen(true)} size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              {tVisits('schedule')}
            </Button>
          </div>
          <CalendarView
            appointments={appointments}
            visits={visits}
            onVisitClick={(v) => setSelectedVisit(v)}
          />
        </div>

        <aside className="md:w-64 md:shrink-0 space-y-4">
          {/* Today's appointments */}
          <div>
            <h2 className="mb-3 text-sm font-semibold">{t('today')}</h2>
            <AppointmentList appointments={todayAppts} />
          </div>

          {/* Today's visits */}
          {todayVisits.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold">{tVisits('title')}</h2>
              <div className="space-y-2">
                {todayVisits.map((v) => (
                  <VisitCard
                    key={v.id}
                    visit={v}
                    onEdit={() => setSelectedVisit(v)}
                  />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Visit creation form */}
      <VisitForm open={visitFormOpen} onClose={() => setVisitFormOpen(false)} />

      {/* Visit detail sheet — key forces internal state reset when a different visit is selected */}
      <VisitDetailSheet
        key={selectedVisit?.id ?? 'none'}
        visit={selectedVisit}
        open={Boolean(selectedVisit)}
        isLandlord={true}
        onClose={() => setSelectedVisit(null)}
      />
    </>
  );
}
