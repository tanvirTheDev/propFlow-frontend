import { useTranslations } from 'next-intl';
import { AuthCard } from '@/components/auth/auth-card';
import { RegisterForm } from '@/components/auth/register-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register — PropFlow',
};

export default function RegisterPage() {
  return <RegisterPageContent />;
}

function RegisterPageContent() {
  const t = useTranslations('auth.register');
  return (
    <AuthCard title={t('title')} subtitle={t('subtitle')}>
      <RegisterForm />
    </AuthCard>
  );
}
