'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';
import { ShieldX } from 'lucide-react';
import { useLogout } from '@/lib/hooks/use-auth';

export default function UnauthorizedPage() {
  const t = useTranslations('unauthorized');
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <Logo size="lg" />
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <ShieldX className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button variant="outline" onClick={() => logout()} disabled={isPending}>
          {t('logout')}
        </Button>
        <Button asChild>
          <Link href="/login">{t('backToLogin')}</Link>
        </Button>
      </div>
    </div>
  );
}
