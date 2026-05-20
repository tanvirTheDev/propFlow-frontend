'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PropertyForm } from '@/components/properties/property-form';
import { useCreateProperty } from '@/lib/hooks/use-properties';
import type { CreatePropertyInput } from '@/lib/api/types';

export default function NewPropertyPage() {
  const t = useTranslations('properties.new');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { mutate: create, isPending } = useCreateProperty();

  function handleSubmit(data: CreatePropertyInput) {
    create(data, {
      onSuccess: (property) => {
        toast.success(t('title') + ' ✓');
        router.push(`/landlord/properties/${property.id}`);
      },
      onError: () => toast.error(tCommon('error')),
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyForm onSubmit={handleSubmit} isLoading={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
