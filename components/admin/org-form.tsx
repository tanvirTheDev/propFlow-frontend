'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  orgName: z.string().min(2),
  landlordName: z.string().min(2),
  landlordEmail: z.string().email(),
  landlordPassword: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

function generatePassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

interface Props {
  onSubmit: (data: FormData) => void;
  isPending: boolean;
}

export function OrgForm({ onSubmit, isPending }: Props) {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common.actions');
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { landlordPassword: generatePassword() },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>{t('orgName')}</Label>
        <Input {...register('orgName')} placeholder="Muster GmbH" className="mt-1" />
        {errors.orgName && <p className="mt-1 text-xs text-destructive">{errors.orgName.message}</p>}
      </div>

      <div className="border-t pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('firstLandlord')}</p>
        <div className="space-y-3">
          <div>
            <Label>{t('form.landlordName')}</Label>
            <Input {...register('landlordName')} className="mt-1" />
            {errors.landlordName && <p className="mt-1 text-xs text-destructive">{errors.landlordName.message}</p>}
          </div>
          <div>
            <Label>{t('form.landlordEmail')}</Label>
            <Input {...register('landlordEmail')} type="email" className="mt-1" />
            {errors.landlordEmail && <p className="mt-1 text-xs text-destructive">{errors.landlordEmail.message}</p>}
          </div>
          <div>
            <Label>{t('form.landlordPassword')}</Label>
            <div className="relative mt-1 flex gap-2">
              <Input {...register('landlordPassword')} type={showPassword ? 'text' : 'password'} className="flex-1" />
              <Button type="button" variant="outline" size="icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button type="button" variant="outline" size="icon" onClick={() => setValue('landlordPassword', generatePassword())}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            {errors.landlordPassword && <p className="mt-1 text-xs text-destructive">{errors.landlordPassword.message}</p>}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? '…' : tCommon('create')}
      </Button>
    </form>
  );
}
