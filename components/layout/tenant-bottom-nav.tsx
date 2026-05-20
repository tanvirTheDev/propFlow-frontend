'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home, Ticket, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/tenant/dashboard', icon: Home, key: 'dashboard' },
  { href: '/tenant/tickets', icon: Ticket, key: 'tickets' },
  { href: '/tenant/my-unit', icon: User, key: 'myUnit' },
  { href: '/tenant/settings', icon: Settings, key: 'settings' },
];

export function TenantBottomNav() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex border-t bg-background">
      {navItems.map(({ href, icon: Icon, key }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
            pathname.startsWith(href)
              ? 'text-primary'
              : 'text-muted-foreground',
          )}
        >
          <Icon className="h-5 w-5" />
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}
