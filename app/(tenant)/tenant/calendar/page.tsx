'use client';

import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { TenantVisitCard } from '@/components/visits/tenant-visit-card';
import { useVisits } from '@/lib/hooks/use-visits';

export default function TenantCalendarPage() {
  const t = useTranslations('visits');
  const tCalendar = useTranslations('calendar');
  const locale = useLocale();
  const dateLocale = locale === 'de' ? de : enUS;

  const { data: visits = [], isLoading } = useVisits();
  const upcoming = visits.filter((v) => v.status === 'SCHEDULED');
  const past = visits.filter((v) => v.status !== 'SCHEDULED');

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="pb-6">
      <h1 className="mb-1 text-xl font-bold">{tCalendar('title')}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{t('upcomingTitle')}</p>

      {upcoming.length === 0 && past.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          {t('empty')}
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t('upcomingTitle')}
              </h2>
              <div className="space-y-3">
                {upcoming.map((v) => (
                  <TenantVisitCard key={v.id} visit={v} />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Past visits
              </h2>
              <div className="space-y-2">
                {past.map((v) => (
                  <div key={v.id} className="rounded-xl border border-gray-200 p-4 opacity-60">
                    <p className="font-medium">{v.property.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(v.scheduledAt), 'EEEE, dd MMM yyyy · HH:mm', { locale: dateLocale })}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground capitalize">{v.status.toLowerCase()}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
