'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight, Building2, Ticket, CalendarClock, TrendingUp,
  Sparkles, ShieldCheck, Star,
} from 'lucide-react';

export function Hero({ dashboardHref }: { dashboardHref?: string | null }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('[data-h="badge"]', { y: 20, opacity: 0, duration: 0.6 })
        .from('[data-h="title"] .line', { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.2')
        .from('[data-h="sub"]', { y: 24, opacity: 0, duration: 0.7 }, '-=0.45')
        .from('[data-h="cta"]', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
        .from('[data-h="trust"]', { y: 16, opacity: 0, duration: 0.6 }, '-=0.35')
        .from('[data-h="mock"]', { y: 60, opacity: 0, scale: 0.96, duration: 1.1 }, '-=0.7')
        .from('[data-h="float"]', { y: 30, opacity: 0, duration: 0.7, stagger: 0.15 }, '-=0.6');

      // Continuous floating cards
      gsap.to('[data-float-loop]', {
        y: '+=14',
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.4, from: 'random' },
      });

      // Subtle parallax drift on the aurora blobs
      gsap.to('[data-blob="1"]', { x: 60, y: 40, duration: 12, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to('[data-blob="2"]', { x: -50, y: -30, duration: 14, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to('[data-blob="3"]', { x: 40, y: -50, duration: 16, ease: 'sine.inOut', repeat: -1, yoyo: true });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-slate-50">
        <div data-blob="1" className="absolute -left-24 top-0 h-[34rem] w-[34rem] rounded-full bg-indigo-400/30 blur-[120px]" />
        <div data-blob="2" className="absolute right-0 top-10 h-[30rem] w-[30rem] rounded-full bg-violet-400/30 blur-[120px]" />
        <div data-blob="3" className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-fuchsia-300/25 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.06) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ── Copy ── */}
        <div>
          <div
            data-h="badge"
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Property management, reimagined for landlords
          </div>

          <h1 data-h="title" className="mt-6 text-[2.6rem] font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            <span className="line block overflow-hidden">Run every property</span>
            <span className="line block overflow-hidden">
              from <span className="gradient-text">one calm place.</span>
            </span>
          </h1>

          <p data-h="sub" className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            PropFlow brings your buildings, tenants, maintenance tickets and viewing
            schedules together — so you spend less time chasing paperwork and more time
            growing your portfolio.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={dashboardHref ?? '/register'}
              data-h="cta"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-95"
            >
              {dashboardHref ? 'Go to your dashboard' : 'Start 1 month free'}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              data-h="cta"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-7 py-3.5 text-base font-bold text-slate-700 shadow-sm backdrop-blur transition-all hover:border-slate-300 hover:bg-white"
            >
              See how it works
            </a>
          </div>

          <div data-h="trust" className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              No credit card required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              Loved by modern landlords
            </span>
          </div>
        </div>

        {/* ── Product mockup ── */}
        <div data-h="mock" className="relative">
          <div className="relative rounded-3xl border border-white/70 bg-white/90 p-3 shadow-2xl shadow-indigo-500/20 backdrop-blur">
            {/* window chrome */}
            <div className="flex items-center gap-1.5 px-2 py-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <div className="ml-3 h-5 flex-1 rounded-md bg-slate-100" />
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              {/* stat row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Building2, label: 'Properties', val: '24', tone: 'from-indigo-500 to-violet-500' },
                  { icon: Ticket, label: 'Open tickets', val: '7', tone: 'from-rose-500 to-pink-500' },
                  { icon: TrendingUp, label: 'Occupancy', val: '96%', tone: 'from-emerald-500 to-teal-500' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                    <div className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br ${s.tone} text-white`}>
                      <s.icon className="h-4 w-4" />
                    </div>
                    <p className="text-lg font-black text-slate-900">{s.val}</p>
                    <p className="text-[11px] font-medium text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* mini bar chart */}
              <div className="mt-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-700">Rent collected</p>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">+18%</span>
                </div>
                <div className="flex h-24 items-end gap-2">
                  {[42, 60, 50, 78, 66, 92, 84].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-md bg-linear-to-t from-indigo-500 to-violet-400" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>

              {/* property row */}
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80"
                  alt="Apartment"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Lindenstraße 14</p>
                  <p className="text-[11px] text-slate-500">8 units · Berlin</p>
                </div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600">All paid</span>
              </div>
            </div>
          </div>

          {/* Floating glass cards */}
          <div
            data-h="float"
            data-float-loop
            className="glass absolute -left-6 top-24 hidden rounded-2xl px-4 py-3 shadow-xl sm:block"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Visit completed</p>
                <p className="text-[11px] text-slate-500">1h 45m on site</p>
              </div>
            </div>
          </div>

          <div
            data-h="float"
            data-float-loop
            className="glass absolute -right-4 bottom-10 hidden rounded-2xl px-4 py-3 shadow-xl sm:block"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500 text-white">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">New ticket</p>
                <p className="text-[11px] text-slate-500">Heating · Unit 3B</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
