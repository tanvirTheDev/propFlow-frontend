'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Search, Building2, List, Map, AlertTriangle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PropertyMap } from '@/components/properties/property-map';
import { useProperties, usePropertyMapData, useRetryGeocode } from '@/lib/hooks/use-properties';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'map';

function MapViewWrapper({ fullHeight }: { fullHeight?: boolean }) {
  const t = useTranslations('properties');
  const { data, isLoading } = usePropertyMapData();
  const { mutate: retryGeocode, isPending } = useRetryGeocode();

  if (isLoading) {
    return <Skeleton className={cn('w-full rounded-2xl', fullHeight ? 'h-full' : 'h-125')} />;
  }

  const hasWarning = (data?.notGeocodedCount ?? 0) > 0;

  return (
    <div className={cn(fullHeight && 'flex h-full flex-col gap-3')}>
      {hasWarning && (
        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{t('map.notGeocodedWarning', { count: data!.notGeocodedCount })}</span>
        </div>
      )}

      {!data?.data?.length ? (
        <div className={cn(
          'flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white text-center shadow-sm',
          fullHeight ? 'flex-1 min-h-0' : 'py-20',
        )}>
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Map className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-medium text-muted-foreground">{t('map.noPoints')}</p>
        </div>
      ) : (
        <PropertyMap
          points={data.data}
          className={cn(
            'w-full rounded-2xl overflow-hidden',
            fullHeight ? 'flex-1 min-h-0' : 'h-125',
          )}
        />
      )}
    </div>
  );
}

export default function PropertiesPage() {
  const t = useTranslations('properties');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const { data, isLoading } = useProperties({
    search: search || undefined,
    page,
    limit: 20,
  });

  return (
    /* In map mode: stretch to full height of main container using flex-col */
    <div className={cn(viewMode === 'map' ? 'flex h-full flex-col gap-4' : 'space-y-4')}>

      {/* ── Compact gradient page header ─────────────────── */}
      <div className="relative shrink-0 overflow-hidden rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-5 py-4 text-white shadow-md shadow-purple-500/20">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-16 h-20 w-20 rounded-full bg-fuchsia-400/20 blur-xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black leading-tight">{t('title')}</h1>
              <p className="text-xs text-purple-200">{t('subtitle')}</p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="h-9 gap-2 rounded-xl border-white/40 bg-white font-semibold text-purple-700 shadow-lg hover:bg-white/90 hover:scale-105 active:scale-95 transition-all"
          >
            <Link href="/landlord/properties/new">
              <Plus className="h-4 w-4" />
              {t('addProperty')}
            </Link>
          </Button>
        </div>
      </div>

      {/* ── View toggle + search ──────────────────────────── */}
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {/* Pill-style segmented control */}
        <div className="flex rounded-xl border border-border/60 bg-white p-0.5 shadow-sm">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <List className="h-3.5 w-3.5" />
            {t('viewList')}
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
              viewMode === 'map'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Map className="h-3.5 w-3.5" />
            {t('viewMap')}
          </button>
        </div>

        {viewMode === 'list' && (
          <div className="relative flex-1 min-w-45">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="rounded-xl pl-9 border-border/60 bg-white shadow-sm focus-visible:ring-primary/30"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      {viewMode === 'map' ? (
        /* flex-1 + min-h-0 makes the map fill all remaining vertical space */
        <div className="flex-1 min-h-0">
          <MapViewWrapper fullHeight />
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-2xl" />
              ))}
            </div>
          ) : !data?.data?.length ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white py-20 text-center shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">{t('noProperties')}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t('noPropertiesHint')}</p>
              <Button className="mt-5" asChild>
                <Link href="/landlord/properties/new">{t('addProperty')}</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((property) => (
                  <Link key={property.id} href={`/landlord/properties/${property.id}`}>
                    <div className="card-hover group relative overflow-hidden rounded-2xl border border-border/60 bg-white p-5 shadow-sm cursor-pointer">
                      <div className="flex items-start gap-4">
                        {/* Gradient icon square */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-700">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-foreground group-hover:text-primary transition-colors">
                            {property.name}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">{property.street}</p>
                          <p className="text-sm text-muted-foreground">
                            {property.postalCode} {property.city}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                          {t('units', { count: property._count?.units ?? 0 })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {(data.total ?? 0) > 20 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-border/60 bg-white shadow-sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    Page {page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-border/60 bg-white shadow-sm"
                    disabled={page * 20 >= (data.total ?? 0)}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
