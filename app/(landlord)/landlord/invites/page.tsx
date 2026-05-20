'use client';

import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
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

function getInviteStatus(invite: TenantInvite): 'accepted' | 'expired' | 'pending' {
  if (invite.acceptedAt) return 'accepted';
  if (new Date(invite.expiresAt) < new Date()) return 'expired';
  return 'pending';
}

const statusVariant = {
  accepted: 'default',
  expired: 'destructive',
  pending: 'outline',
} as const;

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
        onClick={() => resend(invite.id, {
          onSuccess: () => toast.success(t('actions.resent')),
          onError: () => toast.error(tCommon('error')),
        })}
      >
        {t('actions.resend')}
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm">{t('actions.cancel')}</Button>
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
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <CreateInviteDialog />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !invites?.length ? (
        <div className="py-16 text-center text-muted-foreground">
          <p>{t('noInvites')}</p>
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="space-y-3 md:hidden">
            {invites.map((invite) => {
              const status = getInviteStatus(invite);
              return (
                <Card key={invite.id}>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{invite.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{invite.email}</p>
                      </div>
                      <Badge variant={statusVariant[status]} className="shrink-0">
                        {t(`status.${status}`)}
                      </Badge>
                    </div>
                    <p className="mb-3 text-xs text-muted-foreground">
                      {t('table.expires')}: {format(new Date(invite.expiresAt), 'dd MMM yyyy')}
                    </p>
                    <InviteActions invite={invite} status={status} />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table.name')}</TableHead>
                  <TableHead>{t('table.email')}</TableHead>
                  <TableHead>{t('table.status')}</TableHead>
                  <TableHead>{t('table.expires')}</TableHead>
                  <TableHead>{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((invite) => {
                  const status = getInviteStatus(invite);
                  return (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">{invite.name}</TableCell>
                      <TableCell className="text-muted-foreground">{invite.email}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[status]}>{t(`status.${status}`)}</Badge>
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
