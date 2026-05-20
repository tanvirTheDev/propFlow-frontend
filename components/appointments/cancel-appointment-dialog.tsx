'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  isPending: boolean;
}

export function CancelAppointmentDialog({ open, onClose, onConfirm, isPending }: Props) {
  const t = useTranslations('appointments');
  const tCommon = useTranslations('common');
  const [reason, setReason] = useState('');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('cancelConfirm')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder={t('cancelReason')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>{tCommon('actions.cancel')}</Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => onConfirm(reason.trim() || undefined)}
              disabled={isPending}
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
