'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { CalendarDays, Home, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketCard } from '@/components/tickets/ticket-card';
import { EmergencyButton } from '@/components/tickets/emergency-button';
import { useMyUnit } from '@/lib/hooks/use-units';
import { useTickets } from '@/lib/hooks/use-tickets';
import { useUpcomingAppointments } from '@/lib/hooks/use-appointments';

export default function TenantDashboardPage() {
  const t = useTranslations('dashboard.tenant');
  const tTickets = useTranslations('tickets');
  const tAppts = useTranslations('appointments');
  const locale = useLocale();
  const dateLocale = locale === 'de' ? de : enUS;
  const { data: unit, isLoading: loadingUnit } = useMyUnit();
  const { data: ticketsData, isLoading: loadingTickets } = useTickets({ limit: 3 });
  const { data: upcoming = [] } = useUpcomingAppointments();
  const nextAppt = upcoming[0] ?? null;

  return (
    <div className="pt-4 pb-4">
      <h1 className="mb-1 text-xl font-bold">{t('title')}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{t('subtitle')}</p>

      {loadingUnit ? (
        <Skeleton className="h-40 rounded-xl" />
      ) : unit ? (
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">Unit {unit.unitNumber}</div>
                {unit.property && (
                  <>
                    <div className="text-sm text-muted-foreground">{unit.property.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {unit.property.street}, {unit.property.city}
                    </div>
                  </>
                )}
              </div>
            </div>
            <Button className="mt-4 w-full" variant="outline" asChild>
              <Link href="/tenant/my-unit">View details</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mb-6 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No unit assigned yet
        </div>
      )}

      {nextAppt && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{tAppts('upcomingTitle')}</p>
                <p className="mt-0.5 font-semibold truncate">{nextAppt.ticket.title}</p>
                <p className="text-sm text-blue-700">
                  {format(new Date(nextAppt.scheduledAt), 'EEEE, dd MMM · HH:mm', { locale: dateLocale })}
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="mt-3 w-full border-blue-300 text-blue-700 hover:bg-blue-100" asChild>
              <Link href={`/tenant/tickets/${nextAppt.ticketId}`}>{tAppts('viewDetails')}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mb-6">
        <Button className="w-full" size="lg" asChild>
          <Link href="/tenant/tickets/new">
            <Plus className="mr-2 h-5 w-5" />
            {tTickets('submitTicket')}
          </Link>
        </Button>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">{tTickets('myTickets')}</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tenant/tickets">View all</Link>
          </Button>
        </div>
        {loadingTickets ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : !ticketsData?.data?.length ? (
          <p className="text-sm text-muted-foreground">{tTickets('noTickets')}</p>
        ) : (
          <div className="space-y-3">
            {ticketsData.data.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} href={`/tenant/tickets/${ticket.id}`} />
            ))}
          </div>
        )}
      </div>

      <EmergencyButton />
    </div>
  );
}
