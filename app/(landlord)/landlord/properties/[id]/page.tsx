'use client';

import Link from 'next/link';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import {
  Plus, ArrowLeft, User, Clock, Pencil,
  Building2, MapPin, Home,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
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

  const pendingUnitIds = new Set(
    (allInvites ?? [])
      .filter((inv) => !inv.acceptedAt && new Date(inv.expiresAt) > new Date())
      .map((inv) => inv.unitId),
  );

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!property) {
    return <p>{t('errors.notFound')}</p>;
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/landlord/properties">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tCommon('back')}
        </Link>
      </Button>

      {/* ── Property hero card ───────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-5 py-5 text-white shadow-md shadow-purple-500/20">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-16 h-20 w-20 rounded-full bg-fuchsia-400/20 blur-xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-3">
          {/* Info */}
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black leading-tight">{property.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-xs text-purple-200">
                <MapPin className="h-3 w-3" />
                {property.street}, {property.postalCode} {property.city}
              </p>
              <p className="mt-1.5 flex items-center gap-1 text-xs text-purple-200">
                <Home className="h-3 w-3" />
                {property.units?.length ?? 0} unit{(property.units?.length ?? 0) !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 rounded-xl border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            >
              <Link href={`/landlord/properties/${id}/edit`}>
                <Pencil className="h-3.5 w-3.5" />
                Edit Property
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 rounded-xl border-white/40 bg-white font-semibold text-purple-700 shadow hover:bg-white/90 hover:scale-105 transition-all"
            >
              <Link href={`/landlord/properties/${id}/units/new`}>
                <Plus className="h-3.5 w-3.5" />
                {t('detail.addUnit')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Notes */}
        {property.notes && (
          <div className="relative mt-4 rounded-xl bg-white/10 px-3 py-2 text-xs text-purple-100 backdrop-blur-sm">
            {property.notes}
          </div>
        )}
      </div>

      {/* ── Units grid ───────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
          {t('detail.units')}
        </h2>

        {!property.units?.length ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <Home className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600">{t('detail.noUnits')}</p>
            <Button className="mt-4" size="sm" asChild>
              <Link href={`/landlord/properties/${id}/units/new`}>{t('detail.addUnit')}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {property.units.map((unit) => {
              const hasPendingInvite = pendingUnitIds.has(unit.id);
              const isOccupied = Boolean(unit.tenantId);

              return (
                <div
                  key={unit.id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Coloured top accent bar */}
                  <div
                    className={`h-1 w-full ${
                      isOccupied
                        ? 'bg-linear-to-r from-emerald-400 to-green-500'
                        : hasPendingInvite
                        ? 'bg-linear-to-r from-amber-400 to-orange-400'
                        : 'bg-linear-to-r from-indigo-400 to-violet-400'
                    }`}
                  />

                  <div className="p-4">
                    {/* Header row */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-gray-900">
                        {t('detail.unitLabel', { number: unit.unitNumber })}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* Status badge */}
                        {isOccupied ? (
                          <Badge variant="success">{t('detail.occupied')}</Badge>
                        ) : hasPendingInvite ? (
                          <Badge variant="warning" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {tInvites('status.pending')}
                          </Badge>
                        ) : (
                          <Badge variant="outline">{t('detail.vacant')}</Badge>
                        )}
                        {/* Edit button — always visible */}
                        <Link
                          href={`/landlord/properties/${id}/units/${unit.id}/edit`}
                          className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 text-gray-400 transition-all hover:bg-indigo-100 hover:text-indigo-600"
                          title="Edit unit"
                        >
                          <Pencil className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Unit details */}
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400">
                      {unit.floor != null && (
                        <span>{t('detail.floor')}: {unit.floor}</span>
                      )}
                      {unit.bedrooms != null && (
                        <span>{t('detail.bedrooms')}: {unit.bedrooms}</span>
                      )}
                      {unit.sizeM2 != null && (
                        <span>{t('detail.size', { size: unit.sizeM2 })}</span>
                      )}
                    </div>

                    {/* Tenant or invite */}
                    <div className="mt-3">
                      {unit.tenant ? (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                            <User className="h-3 w-3 text-emerald-600" />
                          </div>
                          {unit.tenant.name}
                        </div>
                      ) : (
                        <UnitInviteDialog unitId={unit.id} unitNumber={unit.unitNumber} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
