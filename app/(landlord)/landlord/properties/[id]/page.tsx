'use client';

import Link from 'next/link';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, ArrowLeft, User, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UnitInviteDialog } from '@/components/units/unit-invite-dialog';
import { useProperty } from '@/lib/hooks/use-properties';
import { useInvites } from '@/lib/hooks/use-invites';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('properties');
  const tCommon = useTranslations('common');
  const tInvites = useTranslations('invites');

  const { data: property, isLoading } = useProperty(id);
  const { data: allInvites } = useInvites();

  // Build a set of unitIds that have a pending (non-expired, non-accepted) invite
  const pendingUnitIds = new Set(
    (allInvites ?? [])
      .filter((inv) => !inv.acceptedAt && new Date(inv.expiresAt) > new Date())
      .map((inv) => inv.unitId),
  );

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="mb-6 h-4 w-48" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!property) {
    return <p>{t('errors.notFound')}</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
          <Link href="/landlord/properties">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {tCommon('back')}
          </Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{property.name}</h1>
            <p className="text-muted-foreground">
              {property.street}, {property.postalCode} {property.city}
            </p>
          </div>
          <Button asChild>
            <Link href={`/landlord/properties/${id}/units/new`}>
              <Plus className="mr-2 h-4 w-4" />
              {t('detail.addUnit')}
            </Link>
          </Button>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold">{t('detail.units')}</h2>

      {!property.units?.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">{t('detail.noUnits')}</p>
          <Button className="mt-4" asChild>
            <Link href={`/landlord/properties/${id}/units/new`}>{t('detail.addUnit')}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {property.units.map((unit) => {
            const hasPendingInvite = pendingUnitIds.has(unit.id);
            return (
              <Card key={unit.id}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">
                      {t('detail.unitLabel', { number: unit.unitNumber })}
                    </span>
                    {unit.tenantId ? (
                      <Badge variant="default">{t('detail.occupied')}</Badge>
                    ) : hasPendingInvite ? (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {tInvites('status.pending')}
                      </Badge>
                    ) : (
                      <Badge variant="outline">{t('detail.vacant')}</Badge>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {unit.floor != null && <span>{t('detail.floor')}: {unit.floor} · </span>}
                    {unit.bedrooms != null && <span>{t('detail.bedrooms')}: {unit.bedrooms} · </span>}
                    {unit.sizeM2 != null && <span>{t('detail.size', { size: unit.sizeM2 })}</span>}
                  </div>

                  {unit.tenant ? (
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {unit.tenant.name}
                    </div>
                  ) : (
                    <UnitInviteDialog unitId={unit.id} unitNumber={unit.unitNumber} />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
