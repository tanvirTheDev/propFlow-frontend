'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateTicket } from '@/lib/hooks/use-tickets';
import { useMyUnit } from '@/lib/hooks/use-units';
import type { EmergencyType } from '@/lib/api/types';

const EMERGENCY_TYPES: EmergencyType[] = ['WATER_LEAKAGE', 'HEATING_FAILURE', 'ELECTRICAL_HAZARD', 'SECURITY_ISSUE', 'OTHER'];

export function EmergencyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('tickets.emergencyModal');
  const tTypes = useTranslations('tickets.emergencyType');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { data: unit } = useMyUnit();
  const { mutate: create, isPending } = useCreateTicket();
  const [emergencyType, setEmergencyType] = useState<EmergencyType | ''>('');
  const [description, setDescription] = useState('');

  const submit = () => {
    if (!emergencyType || !unit) return;
    create(
      {
        unitId: unit.id,
        category: 'OTHER',
        priority: 'URGENT',
        title: tTypes(emergencyType),
        description: description.trim() || tTypes(emergencyType),
        photos: [],
        isEmergency: true,
        emergencyType,
      },
      {
        onSuccess: (ticket) => {
          toast.success('Emergency reported!');
          onClose();
          router.push(`/tenant/tickets/${ticket.id}`);
        },
        onError: () => toast.error(tCommon('error')),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-red-300">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle className="text-red-600">{t('title')}</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t('type')}</label>
            <Select value={emergencyType} onValueChange={(v) => setEmergencyType(v as EmergencyType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select emergency type" />
              </SelectTrigger>
              <SelectContent>
                {EMERGENCY_TYPES.map((et) => (
                  <SelectItem key={et} value={et}>{tTypes(et)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">{t('description')}</label>
            <Textarea
              placeholder={t('descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>{tCommon('actions.cancel')}</Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={submit}
              disabled={!emergencyType || isPending || !unit}
            >
              {isPending ? t('submitting') : t('submit')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
