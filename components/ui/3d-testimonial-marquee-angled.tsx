"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type Testimonial = {
  avatar: string;
  name: string;
  quote: string;
  role?: string;
  rating?: number; // 1-5
};

export function ThreeDTestimonialMarqueeAngled({
  items,
  className,
  offsetX,
  offsetY,
}: {
  items: Testimonial[];
  className?: string;
  offsetX?: string | number; // horizontal shift; negative moves content left
  offsetY?: string | number; // vertical shift; positive moves content down
}) {
  // Split into 5 equal-ish columns to fill the top-right space
  const chunkSize = Math.ceil(items.length / 5);
  const chunks: Testimonial[][] = Array.from({ length: 5 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return items.slice(start, start + chunkSize);
  });

  const xOffset = typeof offsetX === "number" ? `${offsetX}px` : (offsetX ?? "0px");
  const yOffset = typeof offsetY === "number" ? `${offsetY}px` : (offsetY ?? "0px");

  return (
    <div data-testid="angled-root" className={cn("w-full h-screen overflow-hidden", className)}>
      <div className="flex size-full items-center justify-center" style={{ perspective: "300px" }}>
        <div className="size-[1720px] shrink-0 scale-[0.6] sm:scale-[0.85] lg:scale-[1.18] xl:scale-[1.28]">
          <div
            className="relative"
            data-testid="angled-positioner"
            style={{
              transform: `translateX(calc(116vw + var(--tx, 0px) + ${xOffset})) translateY(calc(110vh + var(--ty, 0px) + ${yOffset}))`,
            } as React.CSSProperties}
          >
            <div
              style={{
                transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
              }}
              className="relative top-0 right-[50%] grid h-full w-fit origin-top-left grid-cols-[max-content_max-content_max-content_max-content_max-content] gap-0 justify-start transform-3d"
            >
              {chunks.map((subarray, colIndex) => (
                <motion.div
                  data-testid="angled-col"
                  data-col-index={colIndex}
                  key={`col-${colIndex}`}
                  initial={{ y: 0 }}
                  animate={{ y: [-80, 80] }}
                  transition={{
                    duration: colIndex % 2 === 0 ? 10 : 15,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="flex flex-col items-start gap-0"
                >
                  {colIndex > 0 && (
                    <GridLineVertical className="left-0 z-0 pointer-events-none" offset="80px" />
                  )}
                  {subarray.map((t, i) => (
                    <div className="relative" key={`card-${colIndex}-${i}-${t.name}`}>
                      <GridLineHorizontal className="top-0 z-0 pointer-events-none" offset="20px" />
                      <motion.div
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <TestimonialCard item={t} />
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const stars = Math.max(0, Math.min(5, item.rating ?? 5));
  return (
    <div
      className="relative z-20 w-[320px] h-[210px] rounded-2xl border border-[rgba(255,20,147,0.2)] bg-gradient-to-br from-white/98 to-white/92 text-[0.95rem] text-gray-800 shadow-[0_12px_40px_rgba(233,30,99,0.2)] ring-1 ring-[rgba(255,20,147,0.12)] backdrop-blur-xl dark:border-[rgba(255,255,255,0.18)] dark:from-black/55 dark:to-black/45 dark:text-gray-100 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
      data-testid="card"
    >
      {/* content wrapper ensures visual centering regardless of perspective */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 py-7 text-center gap-3">
        <div className="flex flex-col items-center pt-3" data-testid="card-header">
          {/* Avatar container with persistent placeholder background */}
          <span className="relative block h-10 w-10 overflow-hidden rounded-full ring-2 ring-[rgba(255,20,147,0.25)] bg-[url('/assets/avatar-placeholder.svg')] bg-cover bg-center" aria-label="avatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.avatar || "/assets/avatar-placeholder.svg"}
              alt={item.name}
              className="absolute inset-0 h-full w-full rounded-full object-cover opacity-100 transition-opacity duration-200"
              width={40}
              height={40}
              loading="eager"
              decoding="async"
              onLoad={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "1";
              }}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (!img.dataset.fallbackApplied) {
                  img.dataset.fallbackApplied = "true";
                  img.src = "/assets/avatar-placeholder.svg";
                  img.style.opacity = "1"; // reveal placeholder quickly
                }
              }}
            />
          </span>
          <div
            data-fallback
            style={{ display: "none" }}
            className="mt-0 h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FF1493,#F8BBD9)] text-xs font-bold text-white"
          >
            <span>
              {item.name?.split(" ").map((s) => s[0]).join("").slice(0, 2) || "SS"}
            </span>
          </div>
          <div className="mt-1 flex flex-col items-center leading-tight">
            <span className="text-[0.98rem] font-semibold">{item.name}</span>
            {item.role ? (
              <span className="text-[0.7rem] text-gray-500 dark:text-gray-400">{item.role}</span>
            ) : null}
          </div>
        </div>

        <p
          className="mx-auto max-w-[260px] text-balance text-[0.9rem] leading-snug text-gray-800/90 dark:text-gray-100"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.quote}
        </p>

        <div className="mt-1 mb-1 flex justify-center text-[--primary-pink]" aria-label={`${stars} out of 5 stars`} data-testid="card-stars">
          {Array.from({ length: stars }).map((_, i) => (
            <span key={i} className="drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]">★</span>
          ))}
          {Array.from({ length: 5 - stars }).map((_, i) => (
            <span key={`e${i}`} className="opacity-30 drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]">★</span>
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
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
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
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};
