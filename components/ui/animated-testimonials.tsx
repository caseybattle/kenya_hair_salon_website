"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type AnimatedTestimonialItem = {
  avatar: string; // image src
  name: string;
  role?: string; // e.g., city or designation
  quote: string;
  rating?: number; // optional 1-5
};

export function AnimatedTestimonials({
  items,
  className,
  autoplay = true,
  intervalMs = 5000,
}: {
  items: AnimatedTestimonialItem[];
  className?: string;
  autoplay?: boolean;
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);

  const handleNext = () => setActive((p) => (p + 1) % items.length);
  const handlePrev = () => setActive((p) => (p - 1 + items.length) % items.length);
  const isActive = (i: number) => i === active;

  useEffect(() => {
    if (!autoplay || items.length <= 1) return;
    const id = setInterval(handleNext, intervalMs);
    return () => clearInterval(id);
  }, [autoplay, intervalMs, items.length]);

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10; // -10..10

  return (
    <div className={cn("w-full", className)}>
      <div className="relative grid w-full grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left: stacked image cards filling the column */}
        <div className="relative w-full">
          <div className="relative h-[420px] w-full overflow-hidden rounded-xl md:h-[520px]">
            <AnimatePresence>
              {items.map((t, index) => (
                <motion.div
                  key={`${t.avatar}-${index}`}
                  initial={{ opacity: 0, scale: 0.9, z: -100, rotate: randomRotateY() }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.75,
                    scale: isActive(index) ? 1 : 0.96,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index) ? 40 : items.length + 2 - index,
                    y: isActive(index) ? [0, -60, 0] : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.9, z: 100, rotate: randomRotateY() }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="absolute inset-0 origin-bottom"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatar}
                    alt={t.name}
                    width={1000}
                    height={1000}
                    draggable={false}
                    className="h-full w-full rounded-xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: content + controls */}
        <div className="flex w-full flex-col justify-between py-2">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <h3 className="text-2xl font-bold text-[--soft-black] dark:text-white">
              {items[active].name}
            </h3>
            {items[active].role ? (
              <p className="text-sm text-[--soft-gray] dark:text-neutral-400">{items[active].role}</p>
            ) : null}

            {/* Quote with word-by-word reveal */}
            <motion.p className="mt-6 text-lg leading-relaxed text-[--charcoal] dark:text-neutral-300">
              {items[active].quote.split(" ").map((word, i) => (
                <motion.span
                  key={`${active}-${i}-${word}`}
                  initial={{ filter: "blur(10px)", opacity: 0, y: 6 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut", delay: 0.018 * i }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          <div className="mt-8 flex gap-4">
            <button
              aria-label="Previous testimonial"
              onClick={handlePrev}
              className="group/button flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,20,147,0.12)] ring-1 ring-[rgba(255,20,147,0.25)] transition-colors hover:bg-[rgba(255,20,147,0.22)] dark:bg-[rgba(255,255,255,0.08)] dark:ring-[rgba(255,255,255,0.18)]"
            >
              <ChevronLeft className="h-5 w-5 text-[--primary-pink] transition-transform duration-300 group-hover/button:-translate-x-0.5 dark:text-pink-300" />
            </button>
            <button
              aria-label="Next testimonial"
              onClick={handleNext}
              className="group/button flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,20,147,0.12)] ring-1 ring-[rgba(255,20,147,0.25)] transition-colors hover:bg-[rgba(255,20,147,0.22)] dark:bg-[rgba(255,255,255,0.08)] dark:ring-[rgba(255,255,255,0.18)]"
            >
              <ChevronRight className="h-5 w-5 text-[--primary-pink] transition-transform duration-300 group-hover/button:translate-x-0.5 dark:text-pink-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}