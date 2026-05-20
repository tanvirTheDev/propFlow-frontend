'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card p-4 shadow-lg">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Diese Website verwendet technisch notwendige Cookies für Authentifizierung und Sitzungsverwaltung.{' '}
          <Link href="/datenschutz" className="underline">Datenschutz</Link>
        </p>
        <Button size="sm" className="shrink-0" onClick={accept}>
          Akzeptieren
        </Button>
      </div>
    </div>
  );
}
