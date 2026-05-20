'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, Building2, Bell, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogout } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { href: '/admin/organisations', icon: Building2, key: 'organisations' },
  { href: '/admin/notifications', icon: Bell, key: 'notifications' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { mutate: logout } = useLogout();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-xl font-bold text-primary">PropFlow</span>
        <span className="ml-2 rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
          Admin
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map(({ href, icon: Icon, key }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" />
            {t(key)}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
