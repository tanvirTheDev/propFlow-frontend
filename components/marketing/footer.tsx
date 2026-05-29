'use client';

import Link from 'next/link';
import { Building2 } from 'lucide-react';

const COLS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'How it works', href: '#how' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Mission', href: '#mission' },
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Log in', href: '/login' },
      { label: 'Sign up', href: '/register' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">PropFlow</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              The calm workspace for modern landlords. Manage properties, tenants and
              maintenance — all in one place.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate-500 transition-colors hover:text-indigo-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} PropFlow. All rights reserved.</p>
          <p className="text-sm text-slate-400">Built for landlords, in Germany 🇩🇪</p>
        </div>
      </div>
    </footer>
  );
}
