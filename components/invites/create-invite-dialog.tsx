'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { inviteSchema, type InviteFormValues } from '@/lib/validations/invite.schema';
import { useCreateInvite } from '@/lib/hooks/use-invites';
import { useProperties } from '@/lib/hooks/use-properties';
import { useUnitsByProperty } from '@/lib/hooks/use-units';

export function CreateInviteDialog() {
  const [open, setOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const t = useTranslations('invites');
  const tActions = useTranslations('common.actions');
  const tCommon = useTranslations('common');

  const tProperties = useTranslations('properties');
  const { data: propertiesData } = useProperties({ limit: 100 });
  const { data: units } = useUnitsByProperty(selectedPropertyId);
  const { mutate: create, isPending } = useCreateInvite();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { unitId: '', email: '', name: '' },
  });

  const vacantUnits = units?.filter((u) => !u.tenantId) ?? [];

  function handleSubmit(data: InviteFormValues) {
    create(data, {
      onSuccess: () => {
        toast.success(t('actions.sent'));
        form.reset();
        setSelectedPropertyId('');
        setOpen(false);
      },
      onError: () => toast.error(tCommon('error')),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('createInvite')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('createInvite')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">{tProperties('title')}</label>
              <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                <SelectTrigger>
                  <SelectValue placeholder={tProperties('searchPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {propertiesData?.data.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FormField
              control={form.control}
              name="unitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.unit')}</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedPropertyId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('form.unitPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vacantUnits.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {tProperties('detail.unitLabel', { number: u.unitNumber })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('form.namePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('form.emailPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {tActions('cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? '...' : t('createInvite')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
