'use client';

import Image from 'next/image';
import { Compass, Target, Heart } from 'lucide-react';
import { useReveal } from './use-reveal';

export function Mission() {
  const scope = useReveal<HTMLDivElement>();

  return (
    <section id="mission" className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
      <div ref={scope} className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
        {/* Image collage */}
        <div data-reveal className="relative">
          <div className="relative h-[26rem] overflow-hidden rounded-3xl shadow-2xl shadow-indigo-500/20">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1100&q=80"
              alt="Landlord handing over keys"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="glass absolute -bottom-6 -right-4 hidden max-w-[15rem] rounded-2xl p-5 shadow-xl sm:block">
            <p className="text-3xl font-black text-slate-900">100%</p>
            <p className="text-sm font-medium text-slate-600">of your portfolio, organised the way you think</p>
          </div>
          <div className="absolute -left-5 -top-5 -z-10 h-32 w-32 rounded-3xl bg-linear-to-br from-indigo-500 to-violet-500 opacity-20 blur-2xl" />
        </div>

        {/* Copy */}
        <div>
          <span data-reveal className="text-sm font-bold uppercase tracking-wider text-indigo-600">
            Why we built PropFlow
          </span>
          <h2 data-reveal data-reveal-delay="0.05" className="mt-3 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Property management should feel <span className="gradient-text">effortless</span>
          </h2>
          <p data-reveal data-reveal-delay="0.1" className="mt-5 text-lg leading-relaxed text-slate-600">
            Most landlords didn&apos;t sign up to be administrators. They invested in
            buildings — not in chasing emails, losing receipts, or forgetting which unit
            had the leaking tap. We&apos;re here to give that time back.
          </p>

          <div className="mt-10 space-y-6">
            <Value
              icon={Target}
              tone="from-indigo-500 to-violet-500"
              title="Our mission"
              desc="To replace the chaos of spreadsheets and scattered messages with one calm, reliable workspace that any landlord can master in an afternoon."
            />
            <Value
              icon={Compass}
              tone="from-fuchsia-500 to-pink-500"
              title="Our vision"
              desc="A world where managing ten properties feels as simple as managing one — where every tenant is heard and every detail is exactly where you left it."
            />
            <Value
              icon={Heart}
              tone="from-emerald-500 to-teal-500"
              title="Our promise"
              desc="Built for real landlords, fairly priced, and respectful of your data. Try everything free for a month — no card, no tricks."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Value({ icon: Icon, title, desc, tone }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string; desc: string; tone: string;
}) {
  return (
    <div data-reveal className="flex gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${tone} text-white shadow-lg`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-black text-slate-900">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
      </div>
    </div>
  );
}
