'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-2xl font-bold">Etwas ist schiefgelaufen</h2>
      <p className="text-muted-foreground">
        Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Erneut versuchen</Button>
        <Button variant="outline" asChild>
          <Link href="/">Zur Startseite</Link>
        </Button>
      </div>
    </div>
  );
}
