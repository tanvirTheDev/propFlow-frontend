'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useFormatter } from 'next-intl';
import { ArrowLeft, Building2, Users, Home, FileText, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { UserTable } from '@/components/admin/user-table';
import { useOrganisation, useOrgUsers, useUpdateOrg, useAddLandlordToOrg } from '@/lib/hooks/use-admin';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const addLandlordSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});
type AddLandlordForm = z.infer<typeof addLandlordSchema>;

type Tab = 'overview' | 'users';

export default function OrgDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslations('admin');
  const format = useFormatter();
  const [tab, setTab] = useState<Tab>('overview');
  const [showAddLandlord, setShowAddLandlord] = useState(false);

  const { data: org, isLoading: orgLoading } = useOrganisation(id);
  const { data: users, isLoading: usersLoading } = useOrgUsers(id);
  const { mutate: updateOrg, isPending: updating } = useUpdateOrg(id);
  const { mutate: addLandlord, isPending: addingLandlord } = useAddLandlordToOrg(id);

  const [orgName, setOrgName] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddLandlordForm>({
    resolver: zodResolver(addLandlordSchema),
  });

  if (orgLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!org) return null;

  const statCards = [
    { label: t('table.landlords'), value: org.landlordCount, icon: Users },
    { label: t('table.tenants'), value: org.tenantCount, icon: Users },
    { label: t('table.properties'), value: org.propertyCount, icon: Building2 },
    { label: t('table.units'), value: org.unitCount, icon: Home },
    { label: t('table.tickets'), value: org.ticketCount, icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('actions.back')}
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{org.name}</h1>
          <p className="text-sm text-muted-foreground">
            {t('orgs.createdAt')} {format.dateTime(new Date(org.createdAt), { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        {(['overview', 'users'] as Tab[]).map((t_) => (
          <button
            key={t_}
            className={`px-4 py-2 text-sm font-medium transition-colors ${tab === t_ ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setTab(t_)}
          >
            {t(`tabs.${t_}`)}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {statCards.map(({ label, value, icon: Icon }) => (
              <Card key={label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle className="text-base">{t('orgs.rename')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>{t('orgName')}</Label>
                <Input
                  value={orgName || org.name}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                size="sm"
                disabled={updating || (!orgName || orgName === org.name)}
                onClick={() =>
                  updateOrg(
                    { name: orgName },
                    {
                      onSuccess: () => toast.success(t('orgs.renamed')),
                      onError: () => toast.error(t('orgs.renameError')),
                    },
                  )
                }
              >
                {updating ? '…' : t('actions.save')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{users?.length ?? 0} {t('users.total')}</p>
            <Button size="sm" onClick={() => setShowAddLandlord(!showAddLandlord)}>
              <UserPlus className="mr-2 h-4 w-4" />
              {t('actions.addLandlord')}
            </Button>
          </div>

          {showAddLandlord && (
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="text-base">{t('orgs.addLandlordTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit((data) =>
                    addLandlord(data, {
                      onSuccess: () => {
                        toast.success(t('orgs.landlordAdded'));
                        setShowAddLandlord(false);
                        reset();
                      },
                      onError: () => toast.error(t('orgs.addLandlordError')),
                    })
                  )}
                  className="space-y-3"
                >
                  <div>
                    <Label>{t('form.landlordName')}</Label>
                    <Input {...register('name')} className="mt-1" />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label>{t('form.landlordEmail')}</Label>
                    <Input {...register('email')} type="email" className="mt-1" />
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label>{t('form.landlordPassword')}</Label>
                    <Input {...register('password')} type="password" className="mt-1" />
                    {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={addingLandlord}>
                      {addingLandlord ? '…' : t('actions.add')}
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => { setShowAddLandlord(false); reset(); }}>
                      {t('actions.cancel')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {usersLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <UserTable users={users ?? []} orgId={id} />
          )}
        </div>
      )}
    </div>
  );
}
