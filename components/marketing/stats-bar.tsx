'use client';

import { useCountUp } from './use-count-up';

function Stat({ value, suffix, prefix, decimals, label }: {
  value: number; suffix?: string; prefix?: string; decimals?: number; label: string;
}) {
  const ref = useCountUp(value, { suffix, prefix, decimals });
  return (
    <div className="text-center">
      <p className="text-4xl font-black tracking-tight text-white sm:text-5xl">
        <span ref={ref}>{prefix}0{suffix}</span>
      </p>
      <p className="mt-1.5 text-sm font-medium text-indigo-200">{label}</p>
    </div>
  );
}

export function StatsBar() {
  return (
    <section className="relative overflow-hidden bg-linear-to-r from-indigo-700 via-violet-700 to-fuchsia-700 py-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 75% 60%, white 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-10 px-5 sm:px-8 md:grid-cols-4">
        <Stat value={12000} suffix="+" label="Units managed" />
        <Stat value={98} suffix="%" label="Faster ticket resolution" />
        <Stat value={4.9} decimals={1} label="Landlord rating" />
        <Stat value={6} suffix="h" prefix="~" label="Saved every week" />
      </div>
    </section>
  );
}
