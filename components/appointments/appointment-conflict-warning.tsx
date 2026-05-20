'use client';

import { AlertTriangle } from 'lucide-react';

export function AppointmentConflictWarning({ warnings }: { warnings: string[] }) {
  if (!warnings.length) return null;
  return (
    <div className="flex items-start gap-2 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <ul className="space-y-1">
        {warnings.map((w) => <li key={w}>{w}</li>)}
      </ul>
    </div>
  );
}
