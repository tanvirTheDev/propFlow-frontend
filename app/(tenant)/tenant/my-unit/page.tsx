'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyUnit } from '@/lib/hooks/use-units';

export default function MyUnitPage() {
  const t = useTranslations('units.myUnit');
  const { data: unit, isLoading } = useMyUnit();

  if (isLoading) {
    return (
      <div className="pt-4">
        <Skeleton className="mb-4 h-8 w-32" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="pt-4">
        <p className="text-sm text-muted-foreground">No unit assigned yet.</p>
      </div>
    );
  }

  return (
    <div className="pt-4">
      <h1 className="mb-6 text-xl font-bold">{t('title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Unit {unit.unitNumber}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {unit.property && (
            <>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">{t('property')}</p>
                <p className="text-sm font-medium">{unit.property.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">{t('address')}</p>
                <p className="text-sm">
                  {unit.property.street}
                  <br />
                  {unit.property.postalCode} {unit.property.city}
                </p>
              </div>
            </>
          )}
          {unit.floor != null && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">{t('floor')}</p>
              <p className="text-sm">{unit.floor}</p>
            </div>
          )}
          {unit.bedrooms != null && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">{t('bedrooms')}</p>
              <p className="text-sm">{unit.bedrooms}</p>
            </div>
          )}
          {unit.sizeM2 != null && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">{t('size')}</p>
              <p className="text-sm">{unit.sizeM2} m²</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
