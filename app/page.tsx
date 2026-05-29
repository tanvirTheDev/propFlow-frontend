import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { MarketingNav } from '@/components/marketing/marketing-nav';
import { Hero } from '@/components/marketing/hero';
import { StatsBar } from '@/components/marketing/stats-bar';
import { Features } from '@/components/marketing/features';
import { Mission } from '@/components/marketing/mission';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { Pricing } from '@/components/marketing/pricing';
import { FinalCta } from '@/components/marketing/final-cta';
import { MarketingFooter } from '@/components/marketing/footer';

export const metadata: Metadata = {
  title: 'PropFlow — The calm workspace for modern landlords',
  description:
    'Manage your properties, tenants, maintenance tickets and viewing schedules from one place. Try every feature free for a month, then just €99/mo.',
  robots: { index: true, follow: true },
};

interface TokenPayload {
  role: 'SUPER_ADMIN' | 'LANDLORD' | 'TENANT';
  exp: number;
}

const DASHBOARD_BY_ROLE: Record<TokenPayload['role'], string> = {
  SUPER_ADMIN: '/admin/dashboard',
  LANDLORD: '/landlord/dashboard',
  TENANT: '/tenant/dashboard',
};

/** Reads the auth cookie and returns the right dashboard path, or null if logged out. */
async function getDashboardHref(): Promise<string | null> {
  const token = (await cookies()).get('propflow-token')?.value;
  if (!token) return null;
  try {
    const { role, exp } = jwtDecode<TokenPayload>(token);
    if (exp * 1000 < Date.now()) return null;
    return DASHBOARD_BY_ROLE[role] ?? null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const dashboardHref = await getDashboardHref();

  return (
    <main className="min-h-screen bg-white">
      <MarketingNav dashboardHref={dashboardHref} />
      <Hero dashboardHref={dashboardHref} />
      <StatsBar />
      <Features />
      <Mission />
      <HowItWorks />
      <Pricing />
      <FinalCta />
      <MarketingFooter />
    </main>
  );
}
