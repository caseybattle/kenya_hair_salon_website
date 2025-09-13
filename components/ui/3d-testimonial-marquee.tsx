"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import React from "react";

export type Testimonial = {
  avatar: string;
  name: string;
  quote: string;
  role?: string;
  rating?: number; // 1-5
};

export function ThreeDTestimonialMarquee({
  items,
  className,
  duration = 22,
}: {
  items: Testimonial[];
  className?: string;
  duration?: number; // seconds per column scroll
}) {
  // Distribute into 6 balanced columns (fill full width: 1–6)
  const cols = 6;
  const columns: Testimonial[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => {
    columns[i % cols].push(item);
  });

  // Measure single-stack heights for seamless dual-track loop
  const stackRefsA = React.useRef<HTMLDivElement[]>([]);
  const [stackHeights, setStackHeights] = React.useState<number[]>(Array(cols).fill(1000));
  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const measure = React.useCallback(() => {
    const next = columns.map((_, i) => {
      const el = stackRefsA.current[i];
      if (!el) return 1000;
      return Math.max(600, el.scrollHeight);
    });
    setStackHeights(next);
  }, [items]);

  React.useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Keep apparent speed consistent regardless of stack height by deriving speed from the left column
  const baseDistance = stackHeights[0] || 900; // px
  const baseDur = duration; // seconds for left column (original baseline)
  const baseSpeedPxPerSec = (baseDistance / Math.max(1, baseDur)) * 0.06; // ultra calmest motion

  // Measure container height for amplitude clamping
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerH, setContainerH] = React.useState<number>(640);
  React.useEffect(() => {
    const h = containerRef.current?.clientHeight;
    if (typeof h === "number" && h > 0) setContainerH(h);
  }, []);

  return (
    <div ref={containerRef} className={cn("mx-auto block w-full h-[560px] md:h-[640px] lg:h-[700px] overflow-hidden rounded-2xl p-4", className)}>
      <div className="flex size-full items-center justify-center">
        <div
          className="shrink-0 w-full"
          style={{ perspective: "1000px" }}
        >
          <div
            style={{ transform: "rotateX(25deg) rotateY(0deg) rotateZ(-20deg)" }}
            className="relative left-1/2 -translate-x-1/2 grid w-auto origin-center grid-cols-[max-content_max-content_max-content_max-content_max-content_max-content] gap-x-0 gap-y-0 transform-3d transform-gpu md:top-24 lg:top-20"
          >
            {columns.map((subarray, colIndex) => {
              // Use a single track that bounces within the container to avoid out-of-frame jumps
              const repeat = 5; // increase repetition to show more cards vertically
              const stackItems = Array.from({ length: repeat }).flatMap(() => subarray);
              const distance = stackHeights[colIndex] || 900;
              // Clamp movement amplitude to container view area (smaller sway for maximum calm)
              const amp = Math.max(24, Math.min((containerH || 640) * 0.08, distance * 0.08));
              // Maintain consistent speed (px/sec) with slight column variance
              const speedPxPerSec = baseSpeedPxPerSec * (1 - colIndex * 0.08);
              const dur = prefersReduced ? 0 : amp / Math.max(1, speedPxPerSec);

              return (
                <div data-testid="col" key={colIndex + "marquee-col"} className="relative overflow-hidden">
                  <motion.div
                    ref={(el: HTMLDivElement | null) => { if (el) { stackRefsA.current[colIndex] = el; } }}
                    animate={prefersReduced ? undefined : { y: [-amp, amp] }}
                    transition={prefersReduced ? undefined : {
                      duration: dur,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="flex flex-col items-center gap-0 will-change-transform"
                    style={{ willChange: "transform" }}
                  >
                    <GridLineVertical className="-left-1" offset="12px" />
                    {stackItems.map((t, i) => (
                      <div className="relative" key={`A-${colIndex}-${i}-${t.name}`}>
                        <GridLineHorizontal className="-top-1" offset="6px" />
                        <TestimonialCard item={t} />
                      </div>
                    ))}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const stars = Math.max(0, Math.min(5, item.rating ?? 5));
  return (
    <div className="relative z-20 w-[240px] md:w-[250px] h-[150px] md:h-[160px] rounded-xl border border-[rgba(255,20,147,0.2)] bg-white/92 p-3 text-[0.9rem] text-gray-800 shadow-[0_8px_24px_rgba(233,30,99,0.12)] ring-[rgba(255,20,147,0.1)] ring-1 backdrop-blur-md dark:border-[rgba(255,255,255,0.14)] dark:bg-black/45 dark:text-gray-100]">
      <div className="flex h-full flex-col items-center justify-center text-center gap-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.avatar}
          alt={item.name}
          className="h-10 w-10 rounded-full object-cover ring ring-gray-950/10"
          width={40}
          height={40}
        />
        <div className="mt-1 flex flex-col leading-tight items-center">
          <span className="font-semibold">{item.name}</span>
          {item.role ? (
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.role}</span>
          ) : null}
        </div>
        <p className="mt-1 text-[0.9rem] leading-tight line-clamp-3">{item.quote}</p>
        <div className="mt-1 flex justify-center text-[--primary-pink]">
          {Array.from({ length: stars }).map((_, i) => (
            <span key={i}>★</span>
          ))}
          {Array.from({ length: 5 - stars }).map((_, i) => (
            <span key={`e${i}`} className="opacity-30">
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude] z-10 pointer-events-none dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude] z-10 pointer-events-none dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};

