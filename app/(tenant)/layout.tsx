import { TenantBottomNav } from '@/components/layout/tenant-bottom-nav';
import { NotificationBell } from '@/components/layout/notification-bell';
import { LegalFooter } from '@/components/shared/legal-footer';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background px-4">
        <span className="text-lg font-bold text-primary">PropFlow</span>
        <NotificationBell ticketBasePath="/tenant/tickets" />
      </header>
      <main className="flex-1 p-4 pb-24">{children}</main>
      <LegalFooter />
      <TenantBottomNav />
    </div>
  );
}
