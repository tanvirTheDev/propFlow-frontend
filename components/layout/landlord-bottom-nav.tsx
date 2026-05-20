'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Building2, CalendarDays, LayoutDashboard, Ticket, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/landlord/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { href: '/landlord/tickets', icon: Ticket, key: 'tickets' },
  { href: '/landlord/properties', icon: Building2, key: 'properties' },
  { href: '/landlord/calendar', icon: CalendarDays, key: 'calendar' },
  { href: '/landlord/settings', icon: Settings, key: 'settings' },
];

export function LandlordBottomNav() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex border-t bg-background md:hidden">
      {navItems.map(({ href, icon: Icon, key }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
            pathname.startsWith(href) ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          <Icon className="h-5 w-5" />
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}
