'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Building2, Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PropertyForm } from '@/components/properties/property-form';
import { useProperty, useUpdateProperty } from '@/lib/hooks/use-properties';
import type { CreatePropertyInput } from '@/lib/api/types';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const tCommon = useTranslations('common');

  const { data: property, isLoading } = useProperty(id);
  const { mutate: update, isPending } = useUpdateProperty(id);

  function handleSubmit(data: CreatePropertyInput) {
    update(data, {
      onSuccess: () => {
        toast.success('Property updated successfully ✓');
        router.push(`/landlord/properties/${id}`);
      },
      onError: () => toast.error(tCommon('error')),
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href={`/landlord/properties/${id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tCommon('back')}
        </Link>
      </Button>

      {/* Gradient header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-5 py-4 text-white shadow-md shadow-purple-500/20">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-16 h-20 w-20 rounded-full bg-fuchsia-400/20 blur-xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Pencil className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black leading-tight">Edit Property</h1>
            {property && (
              <p className="text-xs text-purple-200">{property.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-xl" />
            ))}
          </div>
        ) : !property ? (
          <p className="text-center text-sm text-gray-500">Property not found.</p>
        ) : (
          <PropertyForm
            defaultValues={{
              name: property.name,
              street: property.street,
              city: property.city,
              postalCode: property.postalCode,
              country: property.country,
              notes: property.notes ?? '',
            }}
            onSubmit={handleSubmit}
            isLoading={isPending}
          />
        )}
      </div>
    </div>
  );
}
