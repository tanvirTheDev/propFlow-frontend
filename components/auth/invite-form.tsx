'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAcceptInvite } from '@/lib/hooks/use-invite';
import { acceptInviteSchema, type AcceptInviteFormData } from '@/lib/validations/auth.schema';
import type { InviteDetails } from '@/lib/api/types';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface InviteFormProps {
  token: string;
  invite: InviteDetails;
}

export function InviteForm({ token, invite }: InviteFormProps) {
  const t = useTranslations('auth.invite');
  const { mutate: acceptInvite, isPending } = useAcceptInvite();

  const form = useForm<AcceptInviteFormData>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = (data: AcceptInviteFormData) => {
    acceptInvite({ token, password: data.password });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-3 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('emailLabel')}</p>
        <p className="text-sm font-medium">{invite.email}</p>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('password')}</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('confirmPassword')}</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('joining')}
              </>
            ) : (
              t('submit')
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
