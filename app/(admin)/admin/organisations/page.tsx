'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrgTable } from '@/components/admin/org-table';
import { useOrganisations } from '@/lib/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrganisationsPage() {
  const t = useTranslations('admin');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrganisations({ page, limit: 20 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('orgs.title')}</h1>
          <p className="text-muted-foreground">{t('orgs.subtitle')}</p>
        </div>
        <Button asChild>
          <Link href="/admin/organisations/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('actions.createOrg')}
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <OrgTable
          orgs={data?.data ?? []}
          total={data?.total ?? 0}
          page={page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
