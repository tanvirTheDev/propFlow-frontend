'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-reveal scope hook.
 *
 * Tag any element inside the returned `scope` ref with `data-reveal` and it will
 * fade + slide up the first time it scrolls into view. Add `data-reveal-delay="0.1"`
 * for staggered entrances. All ScrollTriggers are auto-cleaned by `useGSAP`.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const scope = useRef<T>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const els = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-reveal]'));
      els.forEach((el) => {
        const delay = Number(el.dataset.revealDelay ?? 0);
        gsap.set(el, { opacity: 0, y: 42 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
    },
    { scope },
  );

  return scope;
}
