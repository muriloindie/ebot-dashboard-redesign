"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

export type PageEnterTarget = {
  selector: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
};

type PageEnterOptions = {
  stagger?: number;
  delay?: number;
};

const DEFAULT_TO: gsap.TweenVars = { opacity: 1, y: 0, x: 0, duration: 0.55, ease: "power3.out" };

export function usePageEnter(ref: RefObject<HTMLElement | null>, targets: PageEnterTarget[], options: PageEnterOptions = {}) {
  const { stagger = 0.06, delay = 0.1 } = options;

  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const node = ref.current;
    const tweens = targets.flatMap(({ selector, from = { opacity: 0, y: 18 }, to = {} }) => {
      const els = Array.from(node.querySelectorAll(selector));
      if (!els.length) return [];
      gsap.set(els, { ...from });
      return gsap.to(els, { ...DEFAULT_TO, ...to, stagger, delay });
    });

    return () => tweens.forEach((t) => t.kill());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
