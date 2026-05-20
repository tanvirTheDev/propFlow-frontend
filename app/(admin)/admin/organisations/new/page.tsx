'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrgForm } from '@/components/admin/org-form';
import { useCreateOrganisation } from '@/lib/hooks/use-admin';
import { toast } from 'sonner';

export default function NewOrganisationPage() {
  const t = useTranslations('admin');
  const router = useRouter();
  const { mutate, isPending } = useCreateOrganisation();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('actions.back')}
        </Button>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{t('orgs.createTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <OrgForm
            isPending={isPending}
            onSubmit={(data) =>
              mutate(data, {
                onSuccess: (res) => {
                  toast.success(t('orgs.created'));
                  router.push(`/admin/organisations/${res.data.organisation.id}`);
                },
                onError: () => toast.error(t('orgs.createError')),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
