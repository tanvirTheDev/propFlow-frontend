'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Home, Ticket, User, Settings, CalendarDays, LogOut, Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogout } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const navItems = [
  { href: '/tenant/dashboard', icon: Home,         key: 'dashboard' },
  { href: '/tenant/tickets',   icon: Ticket,       key: 'tickets' },
  { href: '/tenant/calendar',  icon: CalendarDays, key: 'calendar' },
  { href: '/tenant/my-unit',   icon: User,         key: 'myUnit' },
  { href: '/tenant/settings',  icon: Settings,     key: 'settings' },
];

/* ── shared nav link list ──────────────────────────── */
function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { mutate: logout } = useLogout();

  return (
    <>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map(({ href, icon: Icon, key }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {t(key)}
          </Link>
        ))}
      </nav>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={() => { logout(); onNavigate?.(); }}
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </>
  );
}

/* ── desktop sidebar ───────────────────────────────── */
export function TenantSidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-5">
        <span className="text-xl font-bold text-primary">PropFlow</span>
      </div>
      <NavLinks />
    </aside>
  );
}

/* ── mobile hamburger + drawer ─────────────────────── */
export function TenantMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          <div className="flex h-14 items-center border-b px-5">
            <span className="text-xl font-bold text-primary">PropFlow</span>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
