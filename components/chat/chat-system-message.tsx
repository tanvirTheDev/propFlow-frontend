'use client';

import { useTranslations } from 'next-intl';
import { Info } from 'lucide-react';
import type { Message } from '@/lib/api/types';

export function ChatSystemMessage({ message }: { message: Message }) {
  const t = useTranslations('system');

  const render = () => {
    if (!message.systemKey) return message.content;
    try {
      return t(message.systemKey as Parameters<typeof t>[0], message.systemData ?? undefined);
    } catch {
      return message.content;
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <Info className="h-3 w-3 shrink-0 text-muted-foreground" />
      <p className="text-xs italic text-muted-foreground">{render()}</p>
    </div>
  );
}
