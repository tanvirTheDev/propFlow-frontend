import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AuthCard } from '@/components/auth/auth-card';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password — PropFlow',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}

function ForgotPasswordContent() {
  const t = useTranslations('auth.forgotPassword');
  return (
    <AuthCard title={t('title')}>
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">{t('backToLogin')}</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
