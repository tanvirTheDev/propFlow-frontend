'use client';

import Image from 'next/image';
import {
  Building2, Ticket, CalendarClock, Users, BarChart3, BellRing,
} from 'lucide-react';
import { useReveal } from './use-reveal';

export function Features() {
  const scope = useReveal<HTMLDivElement>();

  return (
    <section id="features" className="relative bg-white py-24 sm:py-32">
      <div ref={scope} className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span data-reveal className="text-sm font-bold uppercase tracking-wider text-indigo-600">
            Everything in one place
          </span>
          <h2 data-reveal data-reveal-delay="0.05" className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            The whole portfolio, <span className="gradient-text">under control</span>
          </h2>
          <p data-reveal data-reveal-delay="0.1" className="mt-4 text-lg text-slate-600">
            Stop juggling spreadsheets, WhatsApp messages and sticky notes. PropFlow gives
            you one clean workspace for every part of being a landlord.
          </p>
        </div>

        {/* bento grid */}
        <div className="mt-16 grid auto-rows-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Big feature with image */}
          <div
            data-reveal
            className="group relative col-span-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-sm sm:col-span-2 lg:row-span-2"
          >
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
              alt="Modern apartment buildings"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-slate-900/30" />
            <div className="relative flex h-full min-h-[18rem] flex-col justify-end">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black">Properties &amp; units</h3>
              <p className="mt-2 max-w-md text-sm text-slate-300">
                Add buildings, split them into units, attach documents and photos, and see
                occupancy at a glance. Editing a property or a single unit takes seconds.
              </p>
            </div>
          </div>

          <Feature
            icon={Ticket}
            tone="from-rose-500 to-pink-500"
            title="Maintenance tickets"
            desc="Tenants report issues with photos. You triage, assign and resolve — with a clear status trail on every request."
          />
          <Feature
            icon={CalendarClock}
            tone="from-emerald-500 to-teal-500"
            title="Visits & duration tracking"
            desc="Schedule viewings and inspections, mark them complete, and capture exactly how long you spent on site."
          />
          <Feature
            icon={Users}
            tone="from-indigo-500 to-violet-500"
            title="Tenant invites"
            desc="Invite tenants by email to their own portal. They get updates; you keep one source of truth."
          />
          <Feature
            icon={BarChart3}
            tone="from-amber-500 to-orange-500"
            title="Live dashboard"
            desc="Occupancy, open tickets, upcoming visits and rent health — the numbers that matter, always current."
          />
          <Feature
            icon={BellRing}
            tone="from-sky-500 to-blue-500"
            title="Smart notifications"
            desc="Nobody misses a thing. Tenants and landlords stay in sync on every ticket and scheduled visit."
          />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon: Icon, title, desc, tone }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string; desc: string; tone: string;
}) {
  return (
    <div
      data-reveal
      className="card-hover group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
    >
      <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${tone} text-white shadow-lg`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
    </div>
  );
}
