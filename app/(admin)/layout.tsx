import { AdminSidebar, AdminMobileNav } from '@/components/layout/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Mobile header — hidden on desktop */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 md:hidden">
          <AdminMobileNav />
          <span className="text-base font-bold text-primary">PropFlow</span>
          <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-destructive-foreground">
            Admin
          </span>
        </header>

        <main className="flex-1 overflow-y-auto bg-mesh-slate p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
