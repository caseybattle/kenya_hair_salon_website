"use client";

import { motion, MotionStyle } from "motion/react";
import React from "react";

interface ButtonBeamProps {
  children: React.ReactNode;
  radius?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
  cometSize?: number;
}

export function ButtonBeam({
  children,
  radius = 10,
  duration = 6,
  delay = 0,
  colorFrom = "#F8BBD9",
  colorTo = "#E91E63",
  borderWidth = 2,
  cometSize = 8,
}: ButtonBeamProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [path, setPath] = React.useState<string | null>(null);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const makePath = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      const r = Math.min(radius, Math.floor(Math.min(w, h) / 2));
      // Rounded rectangle path around the wrapper
      const p = `M 0 ${r} A ${r} ${r} 0 0 1 ${r} 0 L ${w - r} 0 A ${r} ${r} 0 0 1 ${w} ${r} L ${w} ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} L ${r} ${h} A ${r} ${r} 0 0 1 0 ${h - r} Z`;
      setPath(p);
    };

    makePath();
    const ro = new ResizeObserver(makePath);
    ro.observe(el);
    return () => ro.disconnect();
  }, [radius]);

  return (
    <div
      ref={ref}
      style={{ position: "relative", borderRadius: 10 }}
    >
      {children}
      {path && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ zIndex: 10, overflow: "hidden" }}
        >
          <motion.div
            className="absolute"
            style={{
              width: cometSize,
              height: cometSize,
              offsetPath: `path("${path}")`,
              background:
                `linear-gradient(90deg, transparent 0%, ${colorFrom} 48%, ${colorTo} 52%, transparent 100%)`,
            } as MotionStyle}
            initial={{ offsetDistance: "0%", opacity: 0.6 }}
            animate={{ offsetDistance: "100%", opacity: [0.6, 0.5, 0.6] }}
            transition={{ repeat: Infinity, ease: "linear", duration, delay }}
          />
          {/* inner stroke to accent edges */}
          <div
            className="absolute inset-0 rounded-[inherit]"
            style={{
              boxShadow: `0 0 0 ${borderWidth}px rgba(233,30,99,0.65) inset`,
            }}
          />
        </div>
      )}
    </div>
  );
}

