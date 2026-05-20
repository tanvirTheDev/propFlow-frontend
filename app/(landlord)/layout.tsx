import { LandlordSidebar } from '@/components/layout/landlord-sidebar';
import { LandlordBottomNav } from '@/components/layout/landlord-bottom-nav';
import { NotificationBell } from '@/components/layout/notification-bell';
import { LegalFooter } from '@/components/shared/legal-footer';

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <LandlordSidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 md:justify-end md:px-6">
          <span className="text-lg font-bold text-primary md:hidden">PropFlow</span>
          <NotificationBell ticketBasePath="/landlord/tickets" />
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 pb-24 md:p-8 md:pb-8">
          {children}
        </main>

        <LegalFooter />
      </div>

      <LandlordBottomNav />
    </div>
  );
}
