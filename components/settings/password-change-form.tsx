'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChangePassword } from '@/lib/hooks/use-profile';

const schema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export function PasswordChangeForm() {
  const t = useTranslations('settings');
  const { mutate, isPending } = useChangePassword();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    mutate({ currentPassword: data.currentPassword, newPassword: data.newPassword }, {
      onSuccess: () => { toast.success(t('passwordChanged')); reset(); },
      onError: () => toast.error(t('passwordError')),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>{t('currentPassword')}</Label>
        <Input {...register('currentPassword')} type="password" className="mt-1" />
        {errors.currentPassword && <p className="mt-1 text-xs text-destructive">{errors.currentPassword.message}</p>}
      </div>
      <div>
        <Label>{t('newPassword')}</Label>
        <Input {...register('newPassword')} type="password" className="mt-1" />
        {errors.newPassword && <p className="mt-1 text-xs text-destructive">{errors.newPassword.message}</p>}
      </div>
      <div>
        <Label>{t('confirmPassword')}</Label>
        <Input {...register('confirmPassword')} type="password" className="mt-1" />
        {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? '…' : t('changePassword')}
      </Button>
    </form>
  );
}
