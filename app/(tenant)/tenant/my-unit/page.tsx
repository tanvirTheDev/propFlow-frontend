'use client';

import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyUnit } from '@/lib/hooks/use-units';
import { Home, Building2, MapPin, Layers, BedDouble, Maximize2 } from 'lucide-react';

export default function MyUnitPage() {
  const t = useTranslations('units.myUnit');
  const { data: unit, isLoading } = useMyUnit();

  if (isLoading) {
    return (
      <div className="space-y-4 pt-2">
        <Skeleton className="h-36 rounded-2xl" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white py-20 text-center shadow-sm mt-2">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Home className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-semibold text-foreground">No unit assigned yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">Contact your landlord to be assigned a unit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {/* ── Hero card ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-600 p-6 text-white shadow-lg shadow-violet-500/25">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-8 h-32 w-32 rounded-full bg-fuchsia-400/20 blur-2xl" />
        <div className="relative">
          <div className="mb-1 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <Home className="h-3 w-3" />
              {t('title')}
            </div>
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Unit {unit.unitNumber}
          </h1>
          {unit.property && (
            <>
              <p className="mt-1 text-lg font-semibold text-violet-200">{unit.property.name}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-violet-300">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {unit.property.street}, {unit.property.postalCode} {unit.property.city}
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Info grid ─────────────────────────────────────── */}
      {unit.property && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                <Building2 className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('property')}</p>
                <p className="text-sm font-bold text-foreground">{unit.property.name}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-fuchsia-100">
                <MapPin className="h-4 w-4 text-fuchsia-600" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('address')}</p>
                <p className="text-sm font-medium text-foreground">
                  {unit.property.street}, {unit.property.postalCode} {unit.property.city}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {unit.floor != null && (
          <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
              <Layers className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('floor')}</p>
            <p className="text-2xl font-black text-foreground">{unit.floor}</p>
          </div>
        )}

        {unit.bedrooms != null && (
          <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
              <BedDouble className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('bedrooms')}</p>
            <p className="text-2xl font-black text-foreground">{unit.bedrooms}</p>
          </div>
        )}

        {unit.sizeM2 != null && (
          <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-100">
              <Maximize2 className="h-4 w-4 text-fuchsia-600" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('size')}</p>
            <p className="text-2xl font-black text-foreground">
              {unit.sizeM2} <span className="text-base font-semibold text-muted-foreground">m²</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
