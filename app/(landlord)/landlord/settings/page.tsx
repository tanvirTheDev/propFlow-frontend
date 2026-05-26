'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
import { Settings, UserCircle, ShieldCheck, AlertTriangle } from 'lucide-react';

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
    <div className="overflow-hidden rounded-2xl border-2 border-red-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-red-100 bg-red-50 px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </div>
        <h2 className="text-sm font-bold text-red-700">{t('deletion.title')}</h2>
      </div>
      <div className="p-5">
        <p className="mb-4 text-sm text-muted-foreground">{t('deletion.description')}</p>
        {submitted ? (
          <p className="text-sm font-medium text-green-600">{t('deletion.submitted')}</p>
        ) : (
          <Button variant="destructive" size="sm" className="rounded-xl" onClick={() => setOpen(true)}>
            {t('deletion.request')}
          </Button>
        )}
      </div>

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
    </div>
  );
}

export default function LandlordSettingsPage() {
  const t = useTranslations('settings');

  return (
    <div className="space-y-4 max-w-xl">
      {/* ── Compact gradient page header ─────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-600 via-slate-700 to-gray-800 px-5 py-4 text-white shadow-md shadow-slate-500/20">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-16 h-20 w-20 rounded-full bg-slate-400/20 blur-xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black leading-tight">{t('title')}</h1>
            <p className="text-xs text-slate-300">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      {/* ── Profile section ───────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-border/60 bg-muted/30 px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
            <UserCircle className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-sm font-bold text-foreground">{t('profileSection')}</h2>
        </div>
        <div className="p-5">
          <ProfileForm />
        </div>
      </div>

      {/* ── Security section ──────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-border/60 bg-muted/30 px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            <ShieldCheck className="h-4 w-4 text-violet-600" />
          </div>
          <h2 className="text-sm font-bold text-foreground">{t('securitySection')}</h2>
        </div>
        <div className="p-5">
          <PasswordChangeForm />
        </div>
      </div>

      {/* ── Danger zone ───────────────────────────────────── */}
      <DeletionRequestCard />
    </div>
  );
}
