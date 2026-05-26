'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface RevealOptions {
  /** delay before animation starts (seconds) */
  delay?: number;
  /** stagger between children (seconds) — if set, animates childSelector elements */
  stagger?: number;
  /** CSS selector for staggered children (default: ':scope > *') */
  childSelector?: string;
  /** y offset to start from in px */
  fromY?: number;
  /** duration in seconds */
  duration?: number;
}

/**
 * Fades + slides in the container (or its children with stagger) on mount.
 * Returns a ref to attach to the wrapper element.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  opts: RevealOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    delay = 0,
    stagger,
    childSelector = ':scope > *',
    fromY = 28,
    duration = 0.55,
  } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger != null ? el.querySelectorAll(childSelector) : [el];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: fromY },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger: stagger ?? 0,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        },
      );
    }, el);

    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}

/**
 * Animates a number from 0 to `value` on mount (count-up effect).
 */
export function useCountUp(value: number, opts: { delay?: number; duration?: number } = {}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || value === 0) {
      if (el) el.textContent = String(value);
      return;
    }

    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: value,
        duration: opts.duration ?? 1.4,
        delay: opts.delay ?? 0.2,
        ease: 'power2.out',
        onUpdate() {
          el.textContent = Math.round(obj.val).toLocaleString();
        },
        onComplete() {
          el.textContent = value.toLocaleString();
        },
      });
    });

    return () => ctx.revert();
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
