'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { ProfileForm } from '@/components/settings/profile-form';
import { PasswordChangeForm } from '@/components/settings/password-change-form';
import { useAuthStore } from '@/lib/stores/auth.store';
import { toast } from 'sonner';

function DeletionRequestCard() {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (confirmEmail !== user?.email) return;
    setSubmitted(true);
    setOpen(false);
    toast.success(t('deletion.success'));
  }

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-base text-destructive">{t('deletion.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">{t('deletion.description')}</p>
        {submitted ? (
          <p className="text-sm font-medium text-green-600">{t('deletion.submitted')}</p>
        ) : (
          <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
            {t('deletion.request')}
          </Button>
        )}
      </CardContent>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deletion.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deletion.confirmDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="email"
            placeholder={user?.email ?? ''}
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            className="my-2"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmEmail('')}>
              {tCommon('actions.cancel')}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={confirmEmail !== user?.email}
              onClick={handleSubmit}
            >
              {t('deletion.confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default function LandlordSettingsPage() {
  const t = useTranslations('settings');

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('profileSection')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('securitySection')}</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>

      <DeletionRequestCard />
    </div>
  );
}
