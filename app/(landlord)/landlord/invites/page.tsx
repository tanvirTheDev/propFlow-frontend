'use client';

import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CreateInviteDialog } from '@/components/invites/create-invite-dialog';
import { useInvites, useResendInvite, useCancelInvite } from '@/lib/hooks/use-invites';
import { toast } from 'sonner';
import type { TenantInvite } from '@/lib/api/types';
import { Mail, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

function getInviteStatus(invite: TenantInvite): 'accepted' | 'expired' | 'pending' {
  if (invite.acceptedAt) return 'accepted';
  if (new Date(invite.expiresAt) < new Date()) return 'expired';
  return 'pending';
}

/* Status styling */
const statusStyles = {
  accepted: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  expired: {
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
  },
  pending: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock,
  },
} as const;

function StatusBadge({ status, label }: { status: ReturnType<typeof getInviteStatus>; label: string }) {
  const { badge, icon: Icon } = statusStyles[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', badge)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function InviteActions({ invite, status }: { invite: TenantInvite; status: ReturnType<typeof getInviteStatus> }) {
  const t = useTranslations('invites');
  const tCommon = useTranslations('common');
  const { mutate: resend } = useResendInvite();
  const { mutate: cancel } = useCancelInvite();

  if (status !== 'pending') return null;

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="rounded-lg border-border/60 text-xs"
        onClick={() => resend(invite.id, {
          onSuccess: () => toast.success(t('actions.resent')),
          onError: () => toast.error(tCommon('error')),
        })}
      >
        {t('actions.resend')}
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-lg text-xs text-muted-foreground">
            {t('actions.cancel')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('actions.cancelConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>{invite.name} ({invite.email})</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => cancel(invite.id, {
              onSuccess: () => toast.success(t('actions.cancelled')),
              onError: () => toast.error(tCommon('error')),
            })}>
              {tCommon('actions.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function InvitesPage() {
  const t = useTranslations('invites');
  const { data: invites, isLoading } = useInvites();

  return (
    <div className="space-y-4">
      {/* ── Compact gradient page header ─────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-teal-500 via-emerald-500 to-green-500 px-5 py-4 text-white shadow-md shadow-emerald-500/20">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-16 h-20 w-20 rounded-full bg-green-400/20 blur-xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black leading-tight">{t('title')}</h1>
              <p className="text-xs text-emerald-100">{t('subtitle')}</p>
            </div>
          </div>
          <CreateInviteDialog />
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : !invites?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white py-20 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Mail className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">{t('noInvites')}</p>
        </div>
      ) : (
        <>
          {/* ── Mobile card view ─────────────────────────── */}
          <div className="space-y-3 md:hidden">
            {invites.map((invite) => {
              const status = getInviteStatus(invite);
              const { dot } = statusStyles[status];
              return (
                <div key={invite.id} className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', dot)} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{invite.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{invite.email}</p>
                      </div>
                    </div>
                    <StatusBadge status={status} label={t(`status.${status}`)} />
                  </div>
                  <p className="mb-3 pl-5 text-xs text-muted-foreground">
                    {t('table.expires')}: {format(new Date(invite.expiresAt), 'dd MMM yyyy')}
                  </p>
                  <div className="pl-5">
                    <InviteActions invite={invite} status={status} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Desktop table view ───────────────────────── */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 bg-muted/40">
                  <TableHead className="font-semibold text-foreground">{t('table.name')}</TableHead>
                  <TableHead className="font-semibold text-foreground">{t('table.email')}</TableHead>
                  <TableHead className="font-semibold text-foreground">{t('table.status')}</TableHead>
                  <TableHead className="font-semibold text-foreground">{t('table.expires')}</TableHead>
                  <TableHead className="font-semibold text-foreground">{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((invite, idx) => {
                  const status = getInviteStatus(invite);
                  return (
                    <TableRow
                      key={invite.id}
                      className={cn(
                        'border-border/40 transition-colors hover:bg-muted/30',
                        idx % 2 === 0 ? 'bg-white' : 'bg-muted/10',
                      )}
                    >
                      <TableCell className="font-medium text-foreground">{invite.name}</TableCell>
                      <TableCell className="text-muted-foreground">{invite.email}</TableCell>
                      <TableCell>
                        <StatusBadge status={status} label={t(`status.${status}`)} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(invite.expiresAt), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell>
                        <InviteActions invite={invite} status={status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
