"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * The applied theme is external state, not React state: the inline script in
 * layout.tsx copies localStorage onto data-theme before first paint, and the
 * CSS falls back to the OS preference when that attribute is absent. Reading
 * it back through a store keeps one source of truth — deriving it a second
 * time in an effect meant a setState on every mount, cascading a render.
 */
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  listeners.add(onStoreChange);
  // Without a stored theme the OS preference is what the CSS follows, so a
  // change to it changes the label too.
  media.addEventListener("change", onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    media.removeEventListener("change", onStoreChange);
  };
}

function getSnapshot(): Theme {
  const applied = document.documentElement.getAttribute("data-theme");
  if (applied === "dark" || applied === "light") return applied;

  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

// The server cannot know the visitor's theme. It renders the light label and
// hydration corrects it, which is what the previous implementation did too.
function getServerSnapshot(): Theme {
  return "light";
}

function applyTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  window.localStorage.setItem("theme", next);
  for (const notify of listeners) notify();
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => applyTheme(isDark ? "light" : "dark")}
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
