'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { TicketFormStepCategory } from '@/components/tickets/ticket-form-step-category';
import { TicketFormStepDetails } from '@/components/tickets/ticket-form-step-details';
import { TicketFormStepReview } from '@/components/tickets/ticket-form-step-review';
import { useCreateTicket } from '@/lib/hooks/use-tickets';
import { useUploadTicketPhotos } from '@/lib/hooks/use-upload';
import { useMyUnit } from '@/lib/hooks/use-units';
import type { TicketCategory, TicketPriority } from '@/lib/api/types';

type Step = 1 | 2 | 3;

export default function NewTicketPage() {
  const t = useTranslations('tickets.form');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { data: unit } = useMyUnit();
  const { mutate: create, isPending: isCreating } = useCreateTicket();
  const { upload, isUploading } = useUploadTicketPhotos();

  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState<TicketCategory | ''>('');
  const [priority, setPriority] = useState<TicketPriority | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const canGoStep2 = Boolean(category);
  const canGoStep3 = Boolean(priority) && title.length >= 5 && description.length >= 10;

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!priority) e.priority = 'Select a priority';
    if (title.length < 5) e.title = 'Min. 5 characters';
    if (description.length < 10) e.description = 'Min. 10 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleNext = () => {
    if (step === 1 && canGoStep2) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    if (!unit || !category || !priority) return;
    let photoUrls: string[] = [];
    if (photos.length) {
      try {
        photoUrls = await upload(photos);
      } catch {
        toast.error('Photo upload failed');
        return;
      }
    }
    create(
      {
        unitId: unit.id,
        category: category as TicketCategory,
        priority: priority as TicketPriority,
        title,
        description,
        photos: photoUrls,
        isEmergency: false,
      },
      {
        onSuccess: (ticket) => {
          toast.success('Ticket submitted!');
          router.push(`/tenant/tickets/${ticket.id}`);
        },
        onError: () => toast.error(tCommon('error')),
      },
    );
  };

  const isPending = isCreating || isUploading;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>{t('step', { current: step, total: 3 })}</span>
          <div className="flex gap-1">
            {([1, 2, 3] as Step[]).map((s) => (
              <div key={s} className={`h-1.5 w-8 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </div>
        <h1 className="text-xl font-bold">
          {step === 1 ? t('step1Title') : step === 2 ? t('step2Title') : t('step3Title')}
        </h1>
      </div>

      <div className="mb-6">
        {step === 1 && (
          <TicketFormStepCategory value={category} onChange={(v) => { setCategory(v); setStep(2); }} />
        )}
        {step === 2 && (
          <TicketFormStepDetails
            priority={priority}
            onPriorityChange={setPriority}
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
            photos={photos}
            onPhotosChange={setPhotos}
            errors={errors}
          />
        )}
        {step === 3 && category && priority && (
          <TicketFormStepReview
            category={category as TicketCategory}
            priority={priority as TicketPriority}
            title={title}
            description={description}
            photos={photos}
            isEmergency={false}
          />
        )}
      </div>

      <div className="flex gap-3">
        {step > 1 && (
          <Button variant="outline" className="flex-1" onClick={() => setStep((s) => (s - 1) as Step)}>
            {t('back')}
          </Button>
        )}
        {step < 3 ? (
          <Button
            className="flex-1"
            onClick={handleNext}
            disabled={step === 1 ? !canGoStep2 : !canGoStep3}
          >
            {t('next')}
          </Button>
        ) : (
          <Button className="flex-1" onClick={handleSubmit} disabled={isPending}>
            {isPending ? t('submitting') : t('submit')}
          </Button>
        )}
      </div>
    </div>
  );
}
