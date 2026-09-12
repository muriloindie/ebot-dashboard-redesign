"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getKpiSegments, type KpiFormat, type KpiSegment } from "@/lib/format";

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

const FONT_SIZE = "text-[31px]";
const DIGIT_HEIGHT = "h-[1.05em]";
const LINE_HEIGHT = "leading-[1.05em]";

function ReelDigit({ digit, easedPercent }: { digit: number; easedPercent: number }) {
  return (
    <span
      className={`relative inline-block ${DIGIT_HEIGHT} w-[0.62em] overflow-hidden font-bebas ${FONT_SIZE} ${LINE_HEIGHT} tracking-[0.01em] text-ebot-dark`}
      style={{ transform: "translateZ(0)" }}
    >
      <span
        className="absolute left-0 top-0 flex flex-col will-change-transform"
        style={{
          transform: `translateY(${-((digit + (1 - easedPercent) * 10) % 10) * 10}%)`,
          transitionDuration: "120ms",
          transitionTimingFunction: "cubic-bezier(0.22, 0.61, 0.36, 1)"
        }}
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className={`flex ${DIGIT_HEIGHT} items-center justify-center`}>
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}

export function ReelNumber({ value, format }: { value: number; format: KpiFormat }) {
  const [displayValue, setDisplayValue] = useState(0);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(value);
      return;
    }

    const target = { value: 0 };
    const tween = gsap.to(target, {
      value,
      duration: 0.85,
      ease: "power3.out",
      onUpdate: () => setDisplayValue(target.value)
    });

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 18, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power3.out" }
      );
    }

    return () => {
      tween.kill();
    };
  }, [value]);

  const segments: KpiSegment[] = getKpiSegments(displayValue, format);
  const displayPercent = value > 0 ? displayValue / value : 0;
  const easedPercent = easeOutCubic(Math.min(1, Math.max(0, displayPercent)));

  return (
    <span ref={containerRef} className="inline-flex items-baseline leading-none">
      {segments.map((segment, index) => {
        if (segment.type === "digit") {
          const digit = parseInt(segment.value, 10);
          return <ReelDigit key={`d-${index}`} digit={digit} easedPercent={easedPercent} />;
        }

        if (segment.type === "separator") {
          return (
            <span
              key={`s-${index}`}
              className={`inline-block font-bebas ${FONT_SIZE} ${LINE_HEIGHT} text-ebot-dark`}
            >
              {segment.value}
            </span>
          );
        }

        return (
          <span
            key={`u-${index}`}
            className="ml-1 inline-block font-bebas text-[18px] leading-[1.4em] text-ebot-primary"
          >
            {segment.value}
          </span>
        );
      })}
    </span>
  );
}
