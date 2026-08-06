"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme") as Theme | null;
    const preferred: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(stored ?? preferred);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("theme", next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      className="inline-flex cursor-pointer items-center gap-2.5 rounded-[3px] border border-line bg-surface px-2.5 py-1.5 text-ink-muted transition-colors duration-200 ease-board hover:border-line-strong hover:text-ink"
    >
      {/* The accessible name has to contain the visible text, so it is built
          from a hidden prefix plus the label rather than an aria-label that
          replaces it. */}
      <span className="sr-only">Tema:</span>
      <span
        aria-hidden="true"
        className="relative block h-3.5 w-7 rounded-full border border-line-strong bg-canvas-alt"
      >
        <span
          className={`absolute top-0.5 size-2 rounded-full bg-accent transition-[left] duration-200 ease-board ${
            isDark ? "left-[15px]" : "left-[3px]"
          }`}
        />
      </span>
      <span className="min-w-[42px] text-left font-mono text-[11px] tracking-[0.12em] uppercase">
        {isDark ? "Noche" : "Día"}
      </span>
    </button>
  );
}
