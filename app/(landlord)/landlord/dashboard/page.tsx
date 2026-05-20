'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Building2, Users, Home, MailOpen, TrendingUp, Ticket, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketCard } from '@/components/tickets/ticket-card';
import { useLandlordDashboard } from '@/lib/hooks/use-dashboard';

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  urgent,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
  urgent?: boolean;
}) {
  return (
    <Card className={urgent && Number(value) > 0 ? 'border-red-300' : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${urgent && Number(value) > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${urgent && Number(value) > 0 ? 'text-red-600' : ''}`}>{value}</div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}

export default function LandlordDashboardPage() {
  const t = useTranslations('dashboard.landlord');
  const tTickets = useTranslations('tickets');
  const { data: stats, isLoading } = useLandlordDashboard();

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {(stats?.emergencyTickets ?? 0) > 0 && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{stats?.emergencyTickets} active emergency ticket{stats?.emergencyTickets !== 1 ? 's' : ''}</span>
          <Button variant="link" size="sm" className="ml-auto text-red-700 h-auto p-0" asChild>
            <Link href="/landlord/tickets?emergency=true">View</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard title={t('totalProperties')} value={stats?.totalProperties ?? 0} icon={Building2} />
        <StatCard title={t('totalUnits')} value={stats?.totalUnits ?? 0} icon={Home} />
        <StatCard title={t('occupiedUnits')} value={stats?.occupiedUnits ?? 0} icon={Users}
          description={`${stats?.occupancyRate ?? 0}% occupancy`} />
        <StatCard title={t('vacantUnits')} value={stats?.vacantUnits ?? 0} icon={Home} />
        <StatCard title={t('pendingInvites')} value={stats?.pendingInvites ?? 0} icon={MailOpen} />
        <StatCard title="Open Tickets" value={stats?.openTickets ?? 0} icon={Ticket} />
        <StatCard title="In Progress" value={stats?.inProgressTickets ?? 0} icon={TrendingUp} />
        <StatCard title="Emergencies" value={stats?.emergencyTickets ?? 0} icon={AlertTriangle} urgent />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('recentProperties')}</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/landlord/properties">View all</Link>
          </Button>
        </div>
        {!stats?.recentProperties?.length ? (
          <p className="text-sm text-muted-foreground">{t('noProperties')}</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {stats.recentProperties.map((p) => (
              <Link key={p.id} href={`/landlord/properties/${p.id}`}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-muted-foreground">{p.street}, {p.city}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{p._count?.units ?? 0} units</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {(stats?.recentTickets?.length ?? 0) > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{tTickets('recentTickets')}</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/landlord/tickets">View all</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {stats?.recentTickets?.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} href={`/landlord/tickets/${ticket.id}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
