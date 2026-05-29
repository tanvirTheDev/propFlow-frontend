'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animates a number from 0 → `value` once it scrolls into view.
 * Returns a ref to attach to the element whose textContent will be updated.
 */
export function useCountUp(value: number, opts?: { decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { decimals = 0, prefix = '', suffix = '' } = opts ?? {};

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const counter = { n: 0 };
      gsap.to(counter, {
        n: value,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${counter.n.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}${suffix}`;
        },
      });
    },
    { dependencies: [value] },
  );

  return ref;
}
