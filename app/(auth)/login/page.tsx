import { useTranslations } from 'next-intl';
import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in — PropFlow',
};

export default function LoginPage() {
  return (
    <LoginPageContent />
  );
}

function LoginPageContent() {
  const t = useTranslations('auth.login');
  return (
    <AuthCard title={t('title')} subtitle={t('subtitle')}>
      <LoginForm />
    </AuthCard>
  );
}
