'use client';

import Link from 'next/link';
import { useTranslations, useFormatter } from 'next-intl';
import { Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlatformStatsCards } from '@/components/admin/platform-stats-cards';
import { useAdminStats, useOrganisations } from '@/lib/hooks/use-admin';

export default function AdminDashboardPage() {
  const t = useTranslations('admin');
  const format = useFormatter();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: orgsData, isLoading: orgsLoading } = useOrganisations({ page: 1, limit: 5 });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      <PlatformStatsCards stats={stats} isLoading={statsLoading} />

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin/organisations/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('actions.createOrg')}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/notifications">
            <AlertTriangle className="mr-2 h-4 w-4" />
            {t('actions.viewFailedNotifications')}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t('dashboard.recentOrgs')}</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/organisations">{t('dashboard.viewAll')}</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {orgsLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded" />
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {orgsData?.data.map((org) => (
                <div key={org.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium text-sm">{org.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {org.landlordCount} landlords · {org.tenantCount} tenants · {org.propertyCount} properties
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {format.dateTime(new Date(org.createdAt), { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/organisations/${org.id}`}>{t('dashboard.view')}</Link>
                    </Button>
                  </div>
                </div>
              ))}
              {orgsData?.data.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">{t('dashboard.noOrgs')}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
