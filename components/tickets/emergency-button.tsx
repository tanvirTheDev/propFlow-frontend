'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import { EmergencyModal } from './emergency-modal';

export function EmergencyButton() {
  const t = useTranslations('tickets');
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-red-700 active:scale-95 transition-transform md:bottom-8 md:right-8"
      >
        <AlertTriangle className="h-4 w-4" />
        {t('emergencyButton')}
      </button>
      <EmergencyModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
