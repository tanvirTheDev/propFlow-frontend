'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { Home, Calendar, Clock, CheckCircle2, Mail, Minus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCancelVisit, useCompleteVisit } from '@/lib/hooks/use-visits';
import type { LandlordVisit } from '@/lib/api/types';

const STATUS_STYLES: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

interface Props {
  visit: LandlordVisit | null;
  open: boolean;
  isLandlord: boolean;
  onClose: () => void;
}

export function VisitDetailSheet({ visit, open, isLandlord, onClose }: Props) {
  const t = useTranslations('visits');
  const locale = useLocale();
  const dateLocale = locale === 'de' ? de : enUS;
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [completeNote, setCompleteNote] = useState('');
  const [endTimeValue, setEndTimeValue] = useState('');
  const [endTimeError, setEndTimeError] = useState('');
  const [showCompleteInput, setShowCompleteInput] = useState(false);

  const { mutate: cancel, isPending: cancelling } = useCancelVisit(visit?.id ?? '');
  const { mutate: complete, isPending: completing } = useCompleteVisit(visit?.id ?? '');

  if (!visit) return null;

  const scheduled = new Date(visit.scheduledAt);
  const dateStr = format(scheduled, 'EEEE, dd MMM yyyy', { locale: dateLocale });
  const timeStr = format(scheduled, 'HH:mm');
  const isScheduled = visit.status === 'SCHEDULED';
  const isCompleted = visit.status === 'COMPLETED';

  // Default end time input to scheduled start (so landlord just adjusts it)
  const defaultEndTimeLocal = format(
    new Date(scheduled.getTime() + 60 * 60 * 1000),
    "yyyy-MM-dd'T'HH:mm",
  );

  // Compute preview duration while landlord picks end time
  const previewDuration = endTimeValue
    ? Math.max(0, Math.round((new Date(endTimeValue).getTime() - scheduled.getTime()) / 60000))
    : null;

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  };

  const handleCancel = () => {
    cancel(cancelReason.trim() || undefined, {
      onSuccess: () => {
        setShowCancelInput(false);
        setCancelReason('');
        onClose();
      },
    });
  };

  const handleComplete = () => {
    if (!endTimeValue) {
      setEndTimeError('Please select the end time of your visit.');
      return;
    }
    if (new Date(endTimeValue) <= scheduled) {
      setEndTimeError('End time must be after the scheduled start time.');
      return;
    }
    setEndTimeError('');
    complete(
      { note: completeNote.trim() || undefined, endTime: new Date(endTimeValue).toISOString() },
      {
        onSuccess: () => {
          setShowCompleteInput(false);
          setCompleteNote('');
          setEndTimeValue('');
          onClose();
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <div className="flex items-center justify-between pr-4">
            <SheetTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-purple-500" />
              {t('title')}
            </SheetTitle>
            <Badge className={STATUS_STYLES[visit.status]}>
              {t(`status.${visit.status}`)}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-4">
          {/* Property */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {t('detail.property')}
            </p>
            <p className="font-semibold">{visit.property.name}</p>
            <p className="text-sm text-muted-foreground">
              {visit.property.street}, {visit.property.postalCode} {visit.property.city}
            </p>
          </div>

          {/* Date / Time / Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                <Calendar className="inline h-3 w-3 mr-1" />
                {t('detail.date')}
              </p>
              <p className="text-sm font-medium">{dateStr}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                <Clock className="inline h-3 w-3 mr-1" />
                {t('detail.time')}
              </p>
              <p className="text-sm font-medium">{timeStr}</p>
            </div>
          </div>

          {/* Actual duration — only shown on completed visits */}
          {isCompleted && visit.durationMin > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-0.5">
                  {t('detail.actualDuration')}
                </p>
                <p className="text-sm font-bold text-emerald-800">
                  {formatDuration(visit.durationMin)}
                </p>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {t('form.reason')}
            </p>
            <p className="text-sm font-medium">{t(`reasons.${visit.reason}`)}</p>
          </div>

          {/* Note */}
          {visit.note && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                {t('form.note')}
              </p>
              <p className="text-sm rounded bg-muted/50 p-2">{visit.note}</p>
            </div>
          )}

          {/* Units table */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              {t('detail.units')}
            </p>
            <div className="rounded-lg border divide-y text-sm">
              <div className="grid grid-cols-3 px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/30">
                <span>{t('detail.unit')}</span>
                <span>{t('detail.tenant')}</span>
                <span>{t('detail.notified')}</span>
              </div>
              {visit.units.map((u) => (
                <div key={u.id} className="grid grid-cols-3 px-3 py-2 items-center">
                  <span className="font-medium">
                    {u.unit?.unitNumber ?? '—'}
                  </span>
                  <span className="text-muted-foreground truncate">
                    {u.tenant?.name ?? (
                      <span className="italic text-xs">{t('detail.vacant')}</span>
                    )}
                  </span>
                  <span>
                    {u.notifyTenant && u.tenantId ? (
                      u.emailSentAt ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {t('detail.emailSent')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-blue-600 text-xs">
                          <Mail className="h-3.5 w-3.5" />
                          {t('detail.pending')}
                        </span>
                      )
                    ) : (
                      <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cancel reason on cancelled visit */}
          {visit.status === 'CANCELLED' && visit.cancelReason && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                {t('detail.cancelReason')}
              </p>
              <p className="text-sm rounded bg-amber-50 p-2 text-amber-800">{visit.cancelReason}</p>
            </div>
          )}

          {/* Landlord actions */}
          {isLandlord && isScheduled && (
            <div className="space-y-3 border-t pt-4">
              {/* Complete */}
              {showCompleteInput ? (
                <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                  <p className="text-sm font-semibold text-emerald-800">{t('detail.markComplete')}</p>

                  {/* End time */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {t('form.endTime')}
                    </Label>
                    <input
                      type="datetime-local"
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                      defaultValue={defaultEndTimeLocal}
                      min={format(scheduled, "yyyy-MM-dd'T'HH:mm")}
                      onChange={(e) => {
                        setEndTimeValue(e.target.value);
                        setEndTimeError('');
                      }}
                    />
                    {endTimeError && (
                      <p className="mt-1 text-xs text-red-600">{endTimeError}</p>
                    )}
                    {/* Live duration preview */}
                    {previewDuration !== null && previewDuration > 0 && (
                      <p className="mt-1.5 text-xs font-medium text-emerald-700">
                        Duration: {formatDuration(previewDuration)}
                      </p>
                    )}
                  </div>

                  {/* Optional note */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {t('form.completionNote')} ({t('form.optional')})
                    </Label>
                    <Textarea
                      value={completeNote}
                      onChange={(e) => setCompleteNote(e.target.value)}
                      rows={2}
                      placeholder={t('form.completionNotePlaceholder')}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowCompleteInput(false);
                        setEndTimeValue('');
                        setEndTimeError('');
                      }}
                    >
                      {t('form.back')}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={handleComplete}
                      disabled={completing}
                    >
                      {completing ? '…' : t('detail.markComplete')}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                  onClick={() => {
                    setShowCompleteInput(true);
                    setEndTimeValue('');
                  }}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t('detail.markComplete')}
                </Button>
              )}

              {/* Cancel */}
              {showCancelInput ? (
                <div className="space-y-2">
                  <Label className="text-sm">{t('detail.cancelReason')}</Label>
                  <Textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={2}
                    placeholder={t('form.cancelReasonPlaceholder')}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowCancelInput(false)}
                    >
                      {t('form.back')}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={handleCancel}
                      disabled={cancelling}
                    >
                      {cancelling ? '…' : t('detail.cancel')}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full text-destructive border-destructive/30 hover:bg-destructive/5"
                  onClick={() => setShowCancelInput(true)}
                >
                  {t('detail.cancel')}
                </Button>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
