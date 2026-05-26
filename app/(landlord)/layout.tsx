import { LandlordSidebar, LandlordMobileNav } from '@/components/layout/landlord-sidebar';
import { NotificationBell } from '@/components/layout/notification-bell';
import { LegalFooter } from '@/components/shared/legal-footer';

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <LandlordSidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
          {/* Mobile: hamburger + logo */}
          <div className="flex items-center gap-2 md:hidden">
            <LandlordMobileNav />
            <span className="text-base font-bold text-primary">PropFlow</span>
          </div>
          {/* Desktop: empty left side (sidebar has logo) */}
          <div className="hidden md:block" />

          <NotificationBell ticketBasePath="/landlord/tickets" />
        </header>

        <main className="flex-1 overflow-y-auto bg-mesh-blue p-4 md:p-8">
          {children}
        </main>

        <LegalFooter />
      </div>
    </div>
  );
}
