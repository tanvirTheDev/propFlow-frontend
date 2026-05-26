'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrgTable } from '@/components/admin/org-table';
import { useOrganisations } from '@/lib/hooks/use-admin';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrganisationsPage() {
  const t = useTranslations('admin');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrganisations({ page, limit: 20 });

  return (
    <div className="space-y-4">
      {/* ── Compact dark slate page header ───────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-700 via-slate-800 to-gray-900 px-5 py-4 text-white shadow-md shadow-slate-700/30">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-16 h-20 w-20 rounded-full bg-slate-500/20 blur-xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black leading-tight">{t('orgs.title')}</h1>
              <p className="text-xs text-slate-400">{t('orgs.subtitle')}</p>
            </div>
          </div>
          <Button
            asChild
            className="h-9 gap-2 rounded-xl bg-white font-semibold text-slate-800 shadow-lg hover:bg-slate-50 hover:scale-105 transition-all"
          >
            <Link href="/admin/organisations/new">
              <Plus className="h-4 w-4" />
              {t('actions.createOrg')}
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Organisation table / loading ─────────────────── */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
          <OrgTable
            orgs={data?.data ?? []}
            total={data?.total ?? 0}
            page={page}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
