'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Mail } from 'lucide-react';
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
import { useCreateInvite } from '@/lib/hooks/use-invites';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Valid email required'),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  unitId: string;
  unitNumber: string;
}

export function UnitInviteDialog({ unitId, unitNumber }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('invites');
  const tCommon = useTranslations('common');
  const tProps = useTranslations('properties');
  const { mutate: create, isPending } = useCreateInvite();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' },
  });

  function handleSubmit(values: FormValues) {
    create(
      { unitId, name: values.name, email: values.email },
      {
        onSuccess: () => {
          toast.success(t('actions.sent'));
          form.reset();
          setOpen(false);
        },
        onError: () => toast.error(tCommon('error')),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="mt-3 w-full gap-1.5">
          <Mail className="h-3.5 w-3.5" />
          {t('inviteTenant')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('inviteTenant')} — {tProps('detail.unitLabel', { number: unitNumber })}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                    <Input type="email" placeholder={t('form.emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {tCommon('actions.cancel')}
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
