'use client';

import { UserPlus, Building, Rocket } from 'lucide-react';
import { useReveal } from './use-reveal';

const STEPS = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create your account',
    desc: 'Sign up in under a minute and start your free month instantly — no credit card needed.',
  },
  {
    icon: Building,
    step: '02',
    title: 'Add your properties',
    desc: 'Bring in your buildings and units, invite your tenants, and import what you already have.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Run everything from one place',
    desc: 'Handle tickets, schedule visits and watch your dashboard stay effortlessly up to date.',
  },
];

export function HowItWorks() {
  const scope = useReveal<HTMLDivElement>();

  return (
    <section id="how" className="bg-white py-24 sm:py-32">
      <div ref={scope} className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span data-reveal className="text-sm font-bold uppercase tracking-wider text-indigo-600">
            Up and running today
          </span>
          <h2 data-reveal data-reveal-delay="0.05" className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Three steps to <span className="gradient-text">calmer days</span>
          </h2>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-9 hidden h-px bg-linear-to-r from-indigo-200 via-violet-300 to-fuchsia-200 md:block" />
          {STEPS.map((s) => (
            <div data-reveal key={s.step} className="relative text-center">
              <div className="relative mx-auto flex h-18 w-18 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 opacity-90 shadow-xl shadow-indigo-500/30" />
                <s.icon className="relative h-8 w-8 text-white" />
              </div>
              <span className="mt-5 inline-block text-xs font-black tracking-widest text-indigo-400">STEP {s.step}</span>
              <h3 className="mt-1 text-xl font-black text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
