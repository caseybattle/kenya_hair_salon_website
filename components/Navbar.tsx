"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:border-neutral-800/60 dark:bg-neutral-950/80 dark:supports-[backdrop-filter]:bg-neutral-900/60">
      <div className="mx-auto flex h-[var(--nav-height)] max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Kenya Hair
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/#services"
            className="hidden text-sm font-medium text-neutral-600 hover:text-neutral-900 sm:inline dark:text-neutral-300 dark:hover:text-white"
          >
            Services
          </Link>
          <Link
            href="/testimonials-preview"
            className="hidden text-sm font-medium text-neutral-600 hover:text-neutral-900 sm:inline dark:text-neutral-300 dark:hover:text-white"
          >
            Testimonials
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
