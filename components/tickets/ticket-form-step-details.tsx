'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PhotoUploader } from './photo-uploader';
import type { TicketPriority } from '@/lib/api/types';

const PRIORITIES: TicketPriority[] = ['URGENT', 'NORMAL', 'LOW'];
const priorityStyle: Record<TicketPriority, string> = {
  URGENT: 'border-red-400 bg-red-50 text-red-700',
  NORMAL: 'border-gray-300 bg-gray-50 text-gray-700',
  LOW: 'border-slate-200 bg-slate-50 text-slate-500',
};

interface Props {
  priority: TicketPriority | '';
  onPriorityChange: (v: TicketPriority) => void;
  title: string;
  onTitleChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  photos: File[];
  onPhotosChange: (files: File[]) => void;
  errors: Partial<Record<string, string>>;
}

export function TicketFormStepDetails({
  priority, onPriorityChange, title, onTitleChange,
  description, onDescriptionChange, photos, onPhotosChange, errors,
}: Props) {
  const t = useTranslations('tickets');

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium">{t('form.priority')}</p>
        <div className="flex gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPriorityChange(p)}
              className={cn(
                'flex-1 rounded-lg border-2 py-2 text-sm font-semibold transition-colors',
                priority === p ? priorityStyle[p] : 'border-border bg-background text-muted-foreground hover:bg-muted',
              )}
            >
              {t(`priority.${p}`)}
            </button>
          ))}
        </div>
        {errors.priority && <p className="mt-1 text-xs text-destructive">{errors.priority}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">{t('form.title')}</label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={t('form.titlePlaceholder')}
          maxLength={200}
        />
        {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">{t('form.description')}</label>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={t('form.descriptionPlaceholder')}
          rows={4}
          maxLength={2000}
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">{description.length}/2000</p>
        {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">{t('form.photos')}</label>
        <PhotoUploader value={photos} onChange={onPhotosChange} />
      </div>
    </div>
  );
}
