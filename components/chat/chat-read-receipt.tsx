'use client';

import { Check, CheckCheck } from 'lucide-react';

type ReceiptStatus = 'sending' | 'sent' | 'read';

export function ChatReadReceipt({ status }: { status: ReceiptStatus }) {
  if (status === 'sending') {
    return <Check className="h-3 w-3 text-muted-foreground/50" />;
  }
  if (status === 'sent') {
    return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
  }
  return <CheckCheck className="h-3 w-3 text-blue-500" />;
}
