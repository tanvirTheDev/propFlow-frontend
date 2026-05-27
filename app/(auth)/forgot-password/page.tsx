import { useTranslations } from 'next-intl';
import { AuthCard } from '@/components/auth/auth-card';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password — PropFlow',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}

function ForgotPasswordContent() {
  const t = useTranslations('auth.forgotPassword');
  return (
    <AuthCard title={t('title')}>
      <ForgotPasswordForm />
    </AuthCard>
  );
}
