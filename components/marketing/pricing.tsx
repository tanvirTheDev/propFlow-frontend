'use client';

import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { useReveal } from './use-reveal';

const FREE_FEATURES = [
  'All features, fully unlocked',
  'Unlimited properties & units',
  'Maintenance tickets',
  'Visit scheduling & duration tracking',
  'Tenant invites & portal',
  'Live dashboard',
];

const PRO_FEATURES = [
  'Everything in Free, forever',
  'Unlimited everything — no caps',
  'Priority email support',
  'Advanced reporting & exports',
  'Document storage for every unit',
  'Early access to new features',
];

export function Pricing() {
  const scope = useReveal<HTMLDivElement>();

  return (
    <section id="pricing" className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.12), transparent 70%)',
        }}
      />
      <div ref={scope} className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span data-reveal className="text-sm font-bold uppercase tracking-wider text-indigo-600">
            Simple, honest pricing
          </span>
          <h2 data-reveal data-reveal-delay="0.05" className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Try it all free, <span className="gradient-text">then just €99</span>
          </h2>
          <p data-reveal data-reveal-delay="0.1" className="mt-4 text-lg text-slate-600">
            Start with a full month on us. No credit card, no feature locks. Upgrade only
            if PropFlow earns its place in your routine.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 lg:grid-cols-2">
          {/* Free */}
          <div data-reveal className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">Free</h3>
            <p className="mt-1 text-sm text-slate-500">Your first month, on the house</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-black tracking-tight text-slate-900">€0</span>
              <span className="text-sm font-medium text-slate-500">/ for 1 month</span>
            </div>
            <p className="mt-2 text-sm font-medium text-emerald-600">Every feature, fully unlocked</p>

            <ul className="mt-8 space-y-3.5">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-base font-bold text-slate-800 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95"
            >
              Start free
            </Link>
          </div>

          {/* Pro — highlighted */}
          <div
            data-reveal
            data-reveal-delay="0.08"
            className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-indigo-500 bg-slate-900 p-8 text-white shadow-2xl shadow-indigo-500/30"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{ backgroundImage: 'radial-gradient(circle at 80% 0%, rgba(139,92,246,0.5), transparent 55%)' }}
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black">Pro</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" /> Most popular
                </span>
              </div>
              <p className="mt-1 text-sm text-indigo-200">From your second month onward</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tight">€99</span>
                <span className="text-sm font-medium text-indigo-200">/ month</span>
              </div>
              <p className="mt-2 text-sm font-medium text-indigo-100">Cancel anytime — no contracts</p>

              <ul className="mt-8 space-y-3.5">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-indigo-50">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/40">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-900/40 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
              >
                Start free, upgrade later
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <p data-reveal className="mt-8 text-center text-sm text-slate-500">
          Questions about a bigger portfolio?{' '}
          <a href="mailto:hello@propflow.app" className="font-semibold text-indigo-600 hover:underline">
            Talk to us
          </a>
        </p>
      </div>
    </section>
  );
}
