'use client';

import { useTranslations, useFormatter } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { UserStatusBadge } from './user-status-badge';
import { useDeactivateUser, useActivateUser } from '@/lib/hooks/use-admin';
import type { OrgUser } from '@/lib/api/types';

const ROLE_COLORS: Record<string, string> = {
  LANDLORD: 'bg-blue-100 text-blue-700',
  TENANT: 'bg-gray-100 text-gray-600',
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
};

interface Props {
  users: OrgUser[];
  orgId: string;
}

export function UserTable({ users, orgId }: Props) {
  const t = useTranslations('admin.users');
  const format = useFormatter();
  const { mutate: deactivate } = useDeactivateUser();
  const { mutate: activate } = useActivateUser();

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('name')}</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('email')}</th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t('role')}</th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t('status')}</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('joined')}</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-0">
              <td className="px-4 py-3 font-medium">{user.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
              <td className="px-4 py-3 text-center">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role] ?? 'bg-gray-100'}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <UserStatusBadge isActive={user.isActive} activeLabel={t('active')} deactivatedLabel={t('deactivatedLabel')} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {format.dateTime(new Date(user.createdAt), { day: '2-digit', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-4 py-3">
                {user.isActive ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/5"
                    onClick={() =>
                      deactivate(user.id, {
                        onSuccess: () => toast.success(t('deactivated')),
                        onError: () => toast.error(t('deactivateError')),
                      })
                    }
                  >
                    {t('deactivate')}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-700 border-green-300 hover:bg-green-50"
                    onClick={() =>
                      activate(user.id, {
                        onSuccess: () => toast.success(t('activated')),
                        onError: () => toast.error(t('activateError')),
                      })
                    }
                  >
                    {t('activate')}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
