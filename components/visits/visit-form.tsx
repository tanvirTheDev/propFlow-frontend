'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { differenceInHours, differenceInMinutes } from 'date-fns';
import { AlertTriangle, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProperties } from '@/lib/hooks/use-properties';
import { useUnitsByProperty } from '@/lib/hooks/use-units';
import { useCreateVisit } from '@/lib/hooks/use-visits';
import { createVisitSchema, VISIT_REASONS, type CreateVisitFormData } from '@/lib/validations/visit.schema';

function minDatetimeLocal(): string {
  return new Date(Date.now() + 31 * 60 * 1000).toISOString().slice(0, 16);
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function VisitForm({ open, onClose }: Props) {
  const t = useTranslations('visits');
  const tCommon = useTranslations('common');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');

  const { data: propertiesData } = useProperties();
  const properties = propertiesData?.data ?? [];
  const { data: units = [], isLoading: loadingUnits } = useUnitsByProperty(selectedPropertyId);
  const { mutate: createVisit, isPending } = useCreateVisit();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createVisitSchema),
    defaultValues: {
      propertyId: '',
      scheduledAt: '',
      reason: '' as CreateVisitFormData['reason'],
      note: '',
      units: [] as CreateVisitFormData['units'],
    },
  });

  const scheduledAt = watch('scheduledAt');
  const selectedUnits = watch('units');

  const hoursUntil = scheduledAt ? differenceInHours(new Date(scheduledAt), new Date()) : 999;
  const show24hWarning = hoursUntil < 24 && hoursUntil >= 0;

  const notifyCount = selectedUnits?.filter((u) => u.notifyTenant).length ?? 0;

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  const handleClose = () => {
    reset();
    setStep(1);
    setSelectedPropertyId('');
    onClose();
  };

  const goToStep2 = async () => {
    const valid = await trigger(['propertyId', 'scheduledAt']);
    if (valid) setStep(2);
  };

  const goToStep3 = async () => {
    const valid = await trigger(['units']);
    if (valid) setStep(3);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const typed = data as CreateVisitFormData;
    createVisit(
      { ...typed, scheduledAt: new Date(typed.scheduledAt).toISOString() },
      { onSuccess: handleClose },
    );
  };

  const toggleUnit = (unitId: string, checked: boolean) => {
    const current = selectedUnits ?? [];
    if (checked) {
      const unit = units.find((u) => u.id === unitId);
      setValue('units', [
        ...current,
        { unitId, notifyTenant: Boolean(unit?.tenantId) },
      ]);
    } else {
      setValue('units', current.filter((u) => u.unitId !== unitId));
    }
  };

  const toggleNotify = (unitId: string, notify: boolean) => {
    const current = selectedUnits ?? [];
    setValue(
      'units',
      current.map((u) => (u.unitId === unitId ? { ...u, notifyTenant: notify } : u)),
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setValue(
        'units',
        units.map((u) => ({ unitId: u.id, notifyTenant: Boolean(u.tenantId) })),
      );
    } else {
      setValue('units', []);
    }
  };

  const allSelected = units.length > 0 && selectedUnits?.length === units.length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('schedule')}</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center gap-1">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  s < step ? 'bg-primary text-primary-foreground' :
                  s === step ? 'border-2 border-primary text-primary' :
                  'border border-muted-foreground text-muted-foreground'
                }`}
              >
                {s < step ? <Check className="h-3 w-3" /> : s}
              </div>
              <span className={s === step ? 'text-foreground font-medium' : ''}>
                {t(`form.step${s}`)}
              </span>
              {s < 3 && <ChevronRight className="h-3 w-3" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ── Step 1: Property & Time ── */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Property */}
              <div>
                <Label>{t('form.property')}</Label>
                <Controller
                  name="propertyId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        setSelectedPropertyId(v);
                        setValue('units', []);
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={t('form.selectProperty')} />
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} — {p.street}, {p.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.propertyId && (
                  <p className="mt-1 text-xs text-destructive">{errors.propertyId.message}</p>
                )}
              </div>

              {/* Date & Time */}
              <div>
                <Label>{t('form.date')} &amp; {t('form.time')}</Label>
                <Input
                  type="datetime-local"
                  min={minDatetimeLocal()}
                  {...register('scheduledAt')}
                  className="mt-1"
                />
                {errors.scheduledAt && (
                  <p className="mt-1 text-xs text-destructive">{errors.scheduledAt.message}</p>
                )}
              </div>

              {/* 24h warning */}
              {show24hWarning && (
                <div className="flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{t('warning24h')}</p>
                </div>
              )}

              <Button type="button" className="w-full" onClick={goToStep2}>
                {t('form.next')} <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* ── Step 2: Units & Tenants ── */}
          {step === 2 && (
            <div className="space-y-4">
              {loadingUnits ? (
                <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
              ) : units.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('form.noUnits')}</p>
              ) : (
                <>
                  {/* Select all */}
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Checkbox
                      id="select-all"
                      checked={allSelected}
                      onCheckedChange={(c) => toggleSelectAll(Boolean(c))}
                    />
                    <Label htmlFor="select-all" className="cursor-pointer font-medium">
                      {t('form.selectAll')}
                    </Label>
                  </div>

                  {/* Unit list */}
                  <div className="space-y-2">
                    {units.map((unit) => {
                      const isSelected = selectedUnits?.some((u) => u.unitId === unit.id);
                      const unitEntry = selectedUnits?.find((u) => u.unitId === unit.id);
                      return (
                        <div
                          key={unit.id}
                          className={`rounded-lg border p-3 ${isSelected ? 'border-primary/40 bg-primary/5' : ''}`}
                        >
                          <div className="flex items-start gap-2">
                            <Checkbox
                              id={unit.id}
                              checked={isSelected ?? false}
                              onCheckedChange={(c) => toggleUnit(unit.id, Boolean(c))}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <Label htmlFor={unit.id} className="cursor-pointer font-medium">
                                Unit {unit.unitNumber}
                              </Label>
                              {unit.tenant ? (
                                <p className="text-sm text-muted-foreground">{unit.tenant.name}</p>
                              ) : (
                                <p className="text-xs text-muted-foreground italic">
                                  {t('detail.vacant')}
                                </p>
                              )}
                            </div>
                            {isSelected && unit.tenantId && (
                              <div className="flex items-center gap-1.5 text-sm">
                                <Checkbox
                                  id={`notify-${unit.id}`}
                                  checked={unitEntry?.notifyTenant ?? false}
                                  onCheckedChange={(c) => toggleNotify(unit.id, Boolean(c))}
                                />
                                <Label htmlFor={`notify-${unit.id}`} className="cursor-pointer text-xs">
                                  {t('form.notifyTenant')}
                                </Label>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {errors.units && (
                <p className="text-xs text-destructive">{errors.units.message}</p>
              )}

              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  <ChevronLeft className="mr-1 h-4 w-4" /> {t('form.back')}
                </Button>
                <Button type="button" className="flex-1" onClick={goToStep3}>
                  {t('form.next')} <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Reason & Summary ── */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Reason */}
              <div>
                <Label>{t('form.reason')}</Label>
                <Controller
                  name="reason"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={t('form.reason')} />
                      </SelectTrigger>
                      <SelectContent>
                        {VISIT_REASONS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {t(`reasons.${r}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.reason && (
                  <p className="mt-1 text-xs text-destructive">{String(errors.reason.message)}</p>
                )}
              </div>

              {/* Note */}
              <div>
                <Label>{t('form.note')}</Label>
                <Textarea
                  placeholder={t('form.notePlaceholder')}
                  {...register('note')}
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Summary */}
              <div className="rounded-lg bg-muted/50 p-3 space-y-1.5 text-sm">
                <p className="font-semibold">{t('form.summary')}</p>
                {selectedProperty && (
                  <p>{selectedProperty.name} — {selectedProperty.street}, {selectedProperty.city}</p>
                )}
                {scheduledAt && (
                  <p>
                    {new Date(scheduledAt).toLocaleDateString()} ·{' '}
                    {new Date(scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
                <p className="text-muted-foreground">
                  {t('form.tenantsToNotify', { count: notifyCount })}
                </p>
              </div>

              {show24hWarning && (
                <div className="flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{t('warning24h')}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  <ChevronLeft className="mr-1 h-4 w-4" /> {t('form.back')}
                </Button>
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? tCommon('loading') : t('form.submit')}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
