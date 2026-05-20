'use client';

import Link from 'next/link';
import { useTranslations, useFormatter } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OrgSummary } from '@/lib/api/types';

interface Props {
  orgs: OrgSummary[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
  limit?: number;
}

export function OrgTable({ orgs, total, page, onPageChange, limit = 20 }: Props) {
  const t = useTranslations('admin');
  const format = useFormatter();
  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('table.name')}</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t('table.landlords')}</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t('table.tenants')}</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t('table.properties')}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('table.created')}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {orgs.map((org) => (
              <tr key={org.id} className="border-b last:border-0 hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{org.name}</td>
                <td className="px-4 py-3 text-center">{org.landlordCount}</td>
                <td className="px-4 py-3 text-center">{org.tenantCount}</td>
                <td className="px-4 py-3 text-center">{org.propertyCount}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {format.dateTime(new Date(org.createdAt), { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/organisations/${org.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{t('pagination', { page, total: totalPages })}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
              ‹
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
              ›
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
