'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UnitForm } from '@/components/units/unit-form';
import { useUnit, useUpdateUnit } from '@/lib/hooks/use-units';
import type { CreateUnitInput } from '@/lib/api/types';

export default function EditUnitPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>;
}) {
  const { id: propertyId, unitId } = use(params);
  const router = useRouter();
  const tCommon = useTranslations('common');

  const { data: unit, isLoading } = useUnit(unitId);
  const { mutate: update, isPending } = useUpdateUnit(unitId, propertyId);

  function handleSubmit(data: CreateUnitInput) {
    update(data, {
      onSuccess: () => {
        toast.success('Unit updated successfully ✓');
        router.push(`/landlord/properties/${propertyId}`);
      },
      onError: () => toast.error(tCommon('error')),
    });
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href={`/landlord/properties/${propertyId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tCommon('back')}
        </Link>
      </Button>

      {/* Gradient header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-600 px-5 py-4 text-white shadow-md shadow-indigo-500/20">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-16 h-20 w-20 rounded-full bg-cyan-400/20 blur-xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Pencil className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black leading-tight">Edit Unit</h1>
            {unit && (
              <p className="text-xs text-blue-200">Unit {unit.unitNumber}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-xl" />
            ))}
          </div>
        ) : !unit ? (
          <p className="text-center text-sm text-gray-500">Unit not found.</p>
        ) : (
          <UnitForm
            defaultValues={{
              unitNumber: unit.unitNumber,
              floor: unit.floor ?? undefined,
              bedrooms: unit.bedrooms ?? undefined,
              sizeM2: unit.sizeM2 ?? undefined,
              notes: unit.notes ?? '',
            }}
            onSubmit={handleSubmit}
            isLoading={isPending}
          />
        )}
      </div>
    </div>
  );
}
