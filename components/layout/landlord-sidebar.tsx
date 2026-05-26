'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Building2, CalendarDays, LogOut, LayoutDashboard,
  Ticket, Settings, Menu, MailOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogout } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const navItems = [
  { href: '/landlord/dashboard',  icon: LayoutDashboard, key: 'dashboard' },
  { href: '/landlord/tickets',    icon: Ticket,           key: 'tickets' },
  { href: '/landlord/properties', icon: Building2,        key: 'properties' },
  { href: '/landlord/calendar',   icon: CalendarDays,    key: 'calendar' },
  { href: '/landlord/invites',    icon: MailOpen,         key: 'invites' },
  { href: '/landlord/settings',   icon: Settings,        key: 'settings' },
];

/* ── shared nav link list ──────────────────────────── */
function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { mutate: logout } = useLogout();

  return (
    <>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map(({ href, icon: Icon, key }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0 transition-transform duration-200', !active && 'group-hover:scale-110')} />
              <span>{t(key)}</span>
              {active && (
                <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/50 p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={() => { logout(); onNavigate?.(); }}
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </>
  );
}

/* ── desktop sidebar ───────────────────────────────── */
export function LandlordSidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border/60 bg-background">
      {/* Logo */}
      <Link
        href="/landlord/dashboard"
        className="flex h-14 items-center gap-2.5 border-b border-border/60 px-5 hover:bg-muted/40 transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
          <Building2 className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-black text-foreground tracking-tight">PropFlow</span>
      </Link>
      <NavLinks />
    </aside>
  );
}

/* ── mobile hamburger + drawer ─────────────────────── */
export function LandlordMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-xl"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0 flex flex-col border-r border-border/60">
          <Link
            href="/landlord/dashboard"
            onClick={() => setOpen(false)}
            className="flex h-14 items-center gap-2.5 border-b border-border/60 px-5 hover:bg-muted/40 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-black tracking-tight">PropFlow</span>
          </Link>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
