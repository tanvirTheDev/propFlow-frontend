'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Building2, Users, Home, Ticket, Mail, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdminPlatformStats } from '@/lib/api/types';

interface Props {
  stats?: AdminPlatformStats;
  isLoading?: boolean;
}

export function PlatformStatsCards({ stats, isLoading }: Props) {
  const t = useTranslations('admin.stats');

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  type StatCard = { key: string; value: number; icon: React.ElementType; urgent?: boolean };
  const cards: StatCard[] = [
    { key: 'orgs', value: stats.organisations, icon: Building2 },
    { key: 'landlords', value: stats.landlords, icon: Users },
    { key: 'tenants', value: stats.tenants, icon: Users },
    { key: 'properties', value: stats.properties, icon: Home },
    { key: 'openTickets', value: stats.tickets.open, icon: Ticket },
    { key: 'emailsToday', value: stats.emailsSentToday, icon: Mail },
    { key: 'failedNotifications', value: stats.failedNotifications, icon: AlertCircle, urgent: stats.failedNotifications > 0 },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, value, icon: Icon, urgent }) => (
        <Card key={key} className={urgent ? 'border-red-300' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t(key as Parameters<typeof t>[0])}
            </CardTitle>
            <Icon className={`h-4 w-4 ${urgent ? 'text-red-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${urgent ? 'text-red-600' : ''}`}>{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
