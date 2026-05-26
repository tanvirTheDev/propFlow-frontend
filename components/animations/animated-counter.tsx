'use client';

import { useCountUp } from '@/lib/hooks/use-gsap-reveal';

interface AnimatedCounterProps {
  value: number;
  delay?: number;
  duration?: number;
  className?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  delay,
  duration,
  className,
  suffix,
}: AnimatedCounterProps) {
  const ref = useCountUp(value, { delay, duration });
  return (
    <span className={className}>
      <span ref={ref}>{value.toLocaleString()}</span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
