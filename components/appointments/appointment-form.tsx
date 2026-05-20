'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createAppointmentSchema, type CreateAppointmentFormData } from '@/lib/validations/appointment.schema';

const DURATION_OPTIONS = [
  { value: 30, labelKey: '30min' },
  { value: 60, labelKey: '1hr' },
  { value: 120, labelKey: '2hr' },
  { value: 240, labelKey: 'half' },
];

interface Props {
  defaultValues?: Partial<CreateAppointmentFormData>;
  onSubmit: (data: CreateAppointmentFormData) => void;
  onCancel: () => void;
  isPending: boolean;
}

function toDatetimeLocal(isoString?: string): string {
  if (!isoString) {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  }
  return new Date(isoString).toISOString().slice(0, 16);
}

function minDatetimeLocal(): string {
  return new Date(Date.now() + 31 * 60 * 1000).toISOString().slice(0, 16);
}

function maxDatetimeLocal(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 16);
}

export function AppointmentForm({ defaultValues, onSubmit, onCancel, isPending }: Props) {
  const t = useTranslations('appointments');
  const tCommon = useTranslations('common');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateAppointmentFormData>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      scheduledAt: toDatetimeLocal(defaultValues?.scheduledAt),
      durationMin: defaultValues?.durationMin ?? 60,
      note: defaultValues?.note ?? '',
    },
  });

  const durationMin = watch('durationMin');

  const handleFormSubmit = (data: CreateAppointmentFormData) => {
    onSubmit({ ...data, scheduledAt: new Date(data.scheduledAt).toISOString() });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label>{t('form.dateTime')}</Label>
        <Input
          type="datetime-local"
          min={minDatetimeLocal()}
          max={maxDatetimeLocal()}
          {...register('scheduledAt')}
          className="mt-1"
        />
        {errors.scheduledAt && <p className="mt-1 text-xs text-destructive">{errors.scheduledAt.message}</p>}
      </div>

      <div>
        <Label>{t('form.duration')}</Label>
        <Select
          value={String(durationMin)}
          onValueChange={(v) => setValue('durationMin', Number(v))}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DURATION_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {t(`duration.${opt.labelKey}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>{t('form.note')}</Label>
        <Textarea
          placeholder={t('form.notePlaceholder')}
          {...register('note')}
          rows={3}
          className="mt-1"
        />
        {errors.note && <p className="mt-1 text-xs text-destructive">{errors.note.message}</p>}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>{tCommon('actions.cancel')}</Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? t('form.saving') : t('form.save')}
        </Button>
      </div>
    </form>
  );
}
