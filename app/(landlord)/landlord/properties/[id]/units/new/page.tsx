'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UnitForm } from '@/components/units/unit-form';
import { useCreateUnit } from '@/lib/hooks/use-units';
import type { CreateUnitInput } from '@/lib/api/types';

export default function NewUnitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: propertyId } = use(params);
  const t = useTranslations('units.new');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { mutate: create, isPending } = useCreateUnit(propertyId);

  function handleSubmit(data: CreateUnitInput) {
    create(data, {
      onSuccess: () => {
        toast.success(t('title') + ' ✓');
        router.push(`/landlord/properties/${propertyId}`);
      },
      onError: () => toast.error(tCommon('error')),
    });
  }

  return (
    <div className="mx-auto max-w-xl">
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-6">
        <Link href={`/landlord/properties/${propertyId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tCommon('back')}
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <UnitForm onSubmit={handleSubmit} isLoading={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
