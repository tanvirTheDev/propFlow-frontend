'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnreadCount } from '@/lib/hooks/use-chat';

interface Props {
  ticketBasePath?: string;
}

export function NotificationBell({ ticketBasePath = '/landlord/tickets' }: Props) {
  const [open, setOpen] = useState(false);
  const { data } = useUnreadCount();

  const count = data?.count ?? 0;
  const tickets = Object.entries(data?.byTicket ?? {});

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border bg-background shadow-lg">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {tickets.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">No unread messages</p>
              ) : (
                tickets.map(([ticketId, unread]) => (
                  <Link
                    key={ticketId}
                    href={`${ticketBasePath}/${ticketId}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted"
                  >
                    <span className="truncate text-muted-foreground">Ticket</span>
                    <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] text-primary-foreground">
                      {unread}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
