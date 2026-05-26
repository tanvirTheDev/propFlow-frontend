import { Logo } from '@/components/shared/logo';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { cn } from '@/lib/utils/cn';
import { Home, ClipboardList, CalendarDays, Bell } from 'lucide-react';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const features = [
  { icon: Home, text: 'Manage properties' },
  { icon: ClipboardList, text: 'Track maintenance' },
  { icon: CalendarDays, text: 'Schedule visits' },
  { icon: Bell, text: 'Smart notifications' },
];

export function AuthCard({ title, subtitle, children, className }: AuthCardProps) {
  return (
    <div className="relative flex min-h-screen bg-secondary/30">
      {/* Language switcher — always top-right */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* ── LEFT panel (desktop only) ─────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 flex-col items-center justify-center p-12 text-white">
        {/* Decorative blurred circles */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 right-8 h-40 w-40 rounded-full bg-indigo-300/20 blur-2xl float" />

        <div className="relative max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-xl font-black backdrop-blur-sm">
              PF
            </div>
            <span className="text-3xl font-black tracking-tight">PropFlow</span>
          </div>

          <h2 className="mb-2 text-3xl font-black leading-tight">
            Smart property<br />management
          </h2>
          <p className="mb-10 text-indigo-200 text-base">
            Everything you need to manage your properties in one place.
          </p>

          {/* Feature bullets */}
          <ul className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-indigo-100">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── RIGHT panel — form ───────────────────────────────── */}
      <div className={cn('flex flex-1 flex-col items-center justify-center px-4 py-12 lg:px-12', className)}>
        {/* Mobile gradient strip */}
        <div className="lg:hidden mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-700 text-xl font-black text-white shadow-lg shadow-indigo-500/30">
            PF
          </div>
          <span className="text-2xl font-black text-foreground">PropFlow</span>
          <p className="text-xs text-muted-foreground">Smart property management</p>
        </div>

        <div className="w-full max-w-md">
          {/* Logo — desktop: above form in right column */}
          <div className="mb-6 hidden lg:flex items-center gap-2">
            <Logo size="md" />
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-border/60 bg-white p-8 shadow-lg shadow-slate-200/60">
            <div className="mb-6 space-y-1 text-center">
              <h1 className="text-2xl font-black text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
