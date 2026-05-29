'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useReveal } from './use-reveal';

export function FinalCta() {
  const scope = useReveal<HTMLDivElement>();

  return (
    <section ref={scope} className="bg-white px-5 py-24 sm:px-8 sm:py-32">
      <div
        data-reveal
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-linear-to-br from-indigo-700 via-violet-700 to-fuchsia-700 px-8 py-16 text-center shadow-2xl shadow-indigo-500/30 sm:px-16 sm:py-20"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, white 1.5px, transparent 1.5px), radial-gradient(circle at 80% 70%, white 1.5px, transparent 1.5px)',
            backgroundSize: '54px 54px',
          }}
        />
        <div className="relative">
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Give yourself the calm you&apos;ve<br className="hidden sm:block" /> been promising your portfolio.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-indigo-100">
            Join the landlords who swapped chaos for clarity. Your first month is completely free.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-indigo-700 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl active:scale-95"
            >
              Start 1 month free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-white/40 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
