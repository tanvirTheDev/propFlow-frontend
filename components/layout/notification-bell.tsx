'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, MessageSquare, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnreadCount } from '@/lib/hooks/use-chat';

interface Props {
  ticketBasePath?: string;
}

export function NotificationBell({ ticketBasePath = '/landlord/tickets' }: Props) {
  const [open, setOpen] = useState(false);
  const { data } = useUnreadCount();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const count   = data?.count ?? 0;
  const tickets = Object.entries(data?.byTicket ?? {});

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-xl hover:bg-muted/60"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-foreground" />
        {count > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </Button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-full z-2000 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-black/10"
          style={{ colorScheme: 'light' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-bold text-gray-900">Notifications</p>
            </div>
            {count > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">
                {count} new
              </span>
            )}
          </div>

          {/* Content */}
          <div className="max-h-72 overflow-y-auto">
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Check className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">All caught up!</p>
                <p className="text-xs text-gray-400">No unread messages</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {tickets.map(([ticketId, unread]) => (
                  <Link
                    key={ticketId}
                    href={`${ticketBasePath}/${ticketId}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                      <MessageSquare className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">Ticket #{ticketId.slice(0, 8)}</p>
                      <p className="text-xs text-gray-500">New message</p>
                    </div>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white shrink-0">
                      {unread}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {tickets.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2.5">
              <Link
                href={ticketBasePath}
                onClick={() => setOpen(false)}
                className="block text-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                View all tickets
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
