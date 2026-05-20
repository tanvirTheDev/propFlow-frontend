'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Search, Building2, List, Map, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PropertyMap } from '@/components/properties/property-map';
import { useProperties, usePropertyMapData, useRetryGeocode } from '@/lib/hooks/use-properties';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ViewMode = 'list' | 'map';

function MapViewWrapper() {
  const t = useTranslations('properties');
  const { data, isLoading } = usePropertyMapData();
  const { mutate: retryGeocode, isPending } = useRetryGeocode();

  if (isLoading) {
    return <Skeleton className="h-[500px] w-full rounded-lg" />;
  }

  return (
    <div>
      {(data?.notGeocodedCount ?? 0) > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{t('map.notGeocodedWarning', { count: data!.notGeocodedCount })}</span>
        </div>
      )}

      {!data?.data?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <Map className="mb-3 h-10 w-10" />
          <p>{t('map.noPoints')}</p>
        </div>
      ) : (
        <PropertyMap points={data.data} className="h-[500px] w-full" />
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
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-md border">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'flex items-center gap-1.5 rounded-l-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted',
              )}
            >
              <List className="h-4 w-4" />
              {t('viewList')}
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                'flex items-center gap-1.5 rounded-r-md border-l px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'map'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted',
              )}
            >
              <Map className="h-4 w-4" />
              {t('viewMap')}
            </button>
          </div>

          <Button asChild>
            <Link href="/landlord/properties/new">
              <Plus className="mr-2 h-4 w-4" />
              {t('addProperty')}
            </Link>
          </Button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <MapViewWrapper />
      ) : (
        <>
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : !data?.data?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="font-medium">{t('noProperties')}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t('noPropertiesHint')}</p>
              <Button className="mt-4" asChild>
                <Link href="/landlord/properties/new">{t('addProperty')}</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((property) => (
                  <Link key={property.id} href={`/landlord/properties/${property.id}`}>
                    <Card className="cursor-pointer transition-shadow hover:shadow-md">
                      <CardContent className="p-5">
                        <div className="mb-1 font-semibold">{property.name}</div>
                        <div className="text-sm text-muted-foreground">{property.street}</div>
                        <div className="text-sm text-muted-foreground">
                          {property.postalCode} {property.city}
                        </div>
                        <div className="mt-3 text-xs font-medium text-primary">
                          {t('units', { count: property._count?.units ?? 0 })}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {data.total > 20 && (
                <div className="mt-6 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center text-sm text-muted-foreground">
                    Page {page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page * 20 >= data.total}
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
