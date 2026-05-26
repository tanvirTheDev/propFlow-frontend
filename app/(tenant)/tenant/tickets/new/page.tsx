'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TicketFormStepCategory } from '@/components/tickets/ticket-form-step-category';
import { TicketFormStepDetails } from '@/components/tickets/ticket-form-step-details';
import { TicketFormStepReview } from '@/components/tickets/ticket-form-step-review';
import { useCreateTicket } from '@/lib/hooks/use-tickets';
import { useUploadTicketPhotos } from '@/lib/hooks/use-upload';
import { useMyUnit } from '@/lib/hooks/use-units';
import type { TicketCategory, TicketPriority } from '@/lib/api/types';

type Step = 1 | 2 | 3;

const STEPS = [
  { n: 1, label: 'Category' },
  { n: 2, label: 'Details' },
  { n: 3, label: 'Review' },
] as const;

export default function NewTicketPage() {
  const t = useTranslations('tickets.form');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { data: unit } = useMyUnit();
  const { mutate: create, isPending: isCreating } = useCreateTicket();
  const { upload, isUploading } = useUploadTicketPhotos();

  const [step, setStep]             = useState<Step>(1);
  const [category, setCategory]     = useState<TicketCategory | ''>('');
  const [priority, setPriority]     = useState<TicketPriority | ''>('');
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos]         = useState<File[]>([]);
  const [errors, setErrors]         = useState<Record<string, string>>({});

  const canGoStep2 = Boolean(category);
  const canGoStep3 = Boolean(priority) && title.length >= 5 && description.length >= 10;

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!priority)              e.priority    = 'Select a priority';
    if (title.length < 5)       e.title       = 'Min. 5 characters';
    if (description.length < 10) e.description = 'Min. 10 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleNext = () => {
    if (step === 1 && canGoStep2)           setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    if (!unit || !category || !priority) return;
    let photoUrls: string[] = [];
    if (photos.length) {
      try { photoUrls = await upload(photos); }
      catch { toast.error('Photo upload failed'); return; }
    }
    create(
      {
        unitId: unit.id,
        category: category as TicketCategory,
        priority: priority as TicketPriority,
        title, description,
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
    <div className="mx-auto max-w-xl pb-4">

      {/* ── Gradient header ──────────────────────────────── */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-5 text-white shadow-lg shadow-purple-500/20">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <h1 className="relative text-xl font-black">
          {step === 1 ? t('step1Title') : step === 2 ? t('step2Title') : t('step3Title')}
        </h1>
        <p className="relative mt-0.5 text-sm text-purple-200">
          {step === 1 ? 'Choose what type of issue you are experiencing' :
           step === 2 ? 'Describe the problem clearly' :
           'Check everything looks correct before submitting'}
        </p>
      </div>

      {/* ── Step progress indicator ───────────────────────── */}
      <div className="mb-6 flex items-center gap-1">
        {STEPS.map(({ n, label }, i) => {
          const done    = n < step;
          const active  = n === step;
          return (
            <div key={n} className="flex items-center gap-1 flex-1">
              <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all w-full justify-center
                ${active  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' :
                  done    ? 'bg-emerald-100 text-emerald-700' :
                  'bg-muted text-muted-foreground'}`}
              >
                {done
                  ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  : <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-current text-[10px]">{n}</span>
                }
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className={`h-4 w-4 shrink-0 ${done ? 'text-emerald-400' : 'text-muted-foreground/40'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step content ─────────────────────────────────── */}
      <div className="mb-6 rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
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

      {/* ── Navigation buttons ────────────────────────────── */}
      <div className="flex gap-3">
        {step > 1 && (
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl font-semibold border-border/60"
            onClick={() => setStep((s) => (s - 1) as Step)}
          >
            {t('back')}
          </Button>
        )}
        {step < 3 ? (
          <Button
            className="flex-1 h-12 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 font-bold shadow-md shadow-purple-300/40 hover:opacity-90 transition-all"
            onClick={handleNext}
            disabled={step === 1 ? !canGoStep2 : !canGoStep3}
          >
            {t('next')} <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button
            className="flex-1 h-12 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 font-bold shadow-md shadow-purple-300/40 hover:opacity-90 transition-all"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? t('submitting') : t('submit')}
          </Button>
        )}
      </div>
    </div>
  );
}
