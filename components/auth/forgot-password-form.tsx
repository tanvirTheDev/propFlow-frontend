'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, Mail, KeyRound, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForgotPassword, useResetPassword } from '@/lib/hooks/use-auth';
import {
  forgotPasswordEmailSchema,
  resetPasswordSchema,
  type ForgotPasswordEmailData,
  type ResetPasswordData,
} from '@/lib/validations/auth.schema';

type Step = 'email' | 'verify' | 'reset' | 'success';

const RESEND_SECONDS = 60;
const CODE_LENGTH = 6;

// ── Step indicator ───────────────────────────────────────────────────────────

function StepDots({ current }: { current: 0 | 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={[
            'h-1.5 rounded-full transition-all duration-300',
            i < current
              ? 'w-6 bg-indigo-400'
              : i === current
                ? 'w-8 bg-indigo-600'
                : 'w-4 bg-gray-200',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

// ── OTP input ────────────────────────────────────────────────────────────────

function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Always produce exactly CODE_LENGTH slots — never rely on padEnd with ''
  const digits = Array.from({ length: CODE_LENGTH }, (_, i) => value[i] ?? '');

  const handleChange = (index: number, char: string) => {
    const clean = char.replace(/\D/g, '').slice(-1);
    const next = digits.map((d, i) => (i === index ? clean : d)).join('');
    onChange(next);
    if (clean && index < CODE_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = digits.map((d, i) => (i === index ? '' : d)).join('');
        onChange(next);
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        const next = digits.map((d, i) => (i === index - 1 ? '' : d)).join('');
        onChange(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    refs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2" role="group" aria-label="Verification code">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={[
            'h-12 w-12 rounded-xl border-2 text-center text-lg font-bold',
            'transition-all duration-150 outline-none',
            'focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20',
            d
              ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
              : 'border-gray-200 bg-white text-gray-900',
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300',
          ].join(' ')}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function ForgotPasswordForm() {
  const t = useTranslations('auth.forgotPassword');

  const [step, setStep] = useState<Step>('email');
  const [emailState, setEmailState] = useState('');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const { mutate: sendCode, isPending: isSending } = useForgotPassword();
  const { mutate: doReset, isPending: isResetting } = useResetPassword();

  // ── Email form ──────────────────────────────────────────────────────────
  const emailForm = useForm<ForgotPasswordEmailData>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: { email: '' },
  });

  // ── Reset password form ─────────────────────────────────────────────────
  const resetForm = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  // ── Countdown timer ─────────────────────────────────────────────────────
  const startCountdown = useCallback(() => {
    setCountdown(RESEND_SECONDS);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleSendCode = (data: ForgotPasswordEmailData) => {
    sendCode(data.email, {
      onSuccess: () => {
        setEmailState(data.email);
        setCode('');
        setCodeError('');
        startCountdown();
        setStep('verify');
        toast.success(t('codeSent'));
      },
      onError: () => {
        emailForm.setError('email', { message: t('resetError') });
      },
    });
  };

  const handleResend = () => {
    if (countdown > 0) return;
    sendCode(emailState, {
      onSuccess: () => {
        startCountdown();
        setCode('');
        setCodeError('');
        toast.success(t('codeSent'));
      },
    });
  };

  const handleVerify = () => {
    if (code.length !== CODE_LENGTH) {
      setCodeError(t('codeInvalid'));
      return;
    }
    setCodeError('');
    setStep('reset');
  };

  const handleReset = (data: ResetPasswordData) => {
    doReset(
      { email: emailState, code, newPassword: data.newPassword },
      {
        onSuccess: () => setStep('success'),
        onError: () => {
          resetForm.setError('newPassword', { message: t('resetError') });
        },
      },
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────

  // ── Step 1: Email ────────────────────────────────────────────────────────
  if (step === 'email') {
    return (
      <div className="space-y-6">
        <StepDots current={0} />

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100">
            <Mail className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-sm text-gray-500">{t('subtitle')}</p>
        </div>

        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(handleSendCode)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('emailLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      autoComplete="email"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('sending')}
                </>
              ) : (
                t('sendCode')
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-gray-500">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('backToLogin')}
          </Link>
        </p>
      </div>
    );
  }

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────
  if (step === 'verify') {
    return (
      <div className="space-y-6">
        <StepDots current={1} />

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
            <KeyRound className="h-6 w-6 text-violet-600" />
          </div>
          <h2 className="text-base font-bold text-gray-900">{t('verifyTitle')}</h2>
          <p className="text-sm text-gray-500">
            {t('verifySubtitle', { email: emailState })}
          </p>
        </div>

        <div className="space-y-3">
          <OtpInput value={code} onChange={setCode} disabled={false} />
          {codeError && (
            <p className="text-center text-xs font-semibold text-red-600">{codeError}</p>
          )}
        </div>

        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={code.length < CODE_LENGTH}
        >
          {t('verifyCode')}
        </Button>

        {/* Resend */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || isSending}
            className={[
              'font-medium transition-colors',
              countdown > 0 || isSending
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-indigo-600 hover:underline cursor-pointer',
            ].join(' ')}
          >
            {isSending ? (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t('sending')}
              </span>
            ) : countdown > 0 ? (
              t('resendIn', { seconds: countdown })
            ) : (
              t('resendCode')
            )}
          </button>
        </div>

        {/* Wrong email? */}
        <p className="text-center text-xs text-gray-400">
          {t('wrongEmail')}{' '}
          <button
            type="button"
            onClick={() => setStep('email')}
            className="font-medium text-indigo-600 hover:underline"
          >
            {emailState}
          </button>
        </p>
      </div>
    );
  }

  // ── Step 3: New password ─────────────────────────────────────────────────
  if (step === 'reset') {
    return (
      <div className="space-y-6">
        <StepDots current={2} />

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100">
            <ShieldCheck className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-base font-bold text-gray-900">{t('newPasswordTitle')}</h2>
          <p className="text-sm text-gray-500">{t('newPasswordSubtitle')}</p>
        </div>

        <Form {...resetForm}>
          <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-4">
            <FormField
              control={resetForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('newPasswordLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={resetForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('confirmPasswordLabel')}</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isResetting}>
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('resetting')}
                </>
              ) : (
                t('resetPassword')
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-xs text-gray-400">
          <button
            type="button"
            onClick={() => setStep('verify')}
            className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('backToLogin')}
          </button>
        </p>
      </div>
    );
  }

  // ── Step 4: Success ──────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 text-center py-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="h-9 w-9 text-emerald-500" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-black text-gray-900">{t('successTitle')}</h2>
        <p className="text-sm text-gray-500">{t('successSubtitle')}</p>
      </div>

      <Button asChild className="w-full">
        <Link href="/login">{t('goToLogin')}</Link>
      </Button>
    </div>
  );
}
