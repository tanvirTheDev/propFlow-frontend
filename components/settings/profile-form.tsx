'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile, useUpdateProfile } from '@/lib/hooks/use-profile';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  language: z.enum(['en', 'de']),
});
type FormData = z.infer<typeof schema>;

export function ProfileForm() {
  const t = useTranslations('settings');
  const { data: profile } = useProfile();
  const { mutate, isPending } = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', language: 'de' },
  });

  useEffect(() => {
    if (profile) {
      reset({ name: profile.name, phone: profile.phone ?? '', language: (profile.language as 'en' | 'de') ?? 'de' });
    }
  }, [profile, reset]);

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => toast.success(t('saved')),
      onError: () => toast.error(t('saveError')),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>{t('name')}</Label>
        <Input {...register('name')} className="mt-1" />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div>
        <Label>{t('email')}</Label>
        <Input value={profile?.email ?? ''} disabled className="mt-1 bg-muted" />
        <p className="mt-1 text-xs text-muted-foreground">{t('emailReadOnly')}</p>
      </div>

      <div>
        <Label>{t('phone')}</Label>
        <Input {...register('phone')} type="tel" className="mt-1" placeholder="+49 123 456" />
      </div>

      <div>
        <Label>{t('language')}</Label>
        <select {...register('language')} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
          <option value="de">Deutsch</option>
          <option value="en">English</option>
        </select>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? '…' : t('save')}
      </Button>
    </form>
  );
}
