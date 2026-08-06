"use client";

import { useEffect, useState } from "react";

import styles from "./ThemeToggle.module.css";

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

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-pressed={theme === "dark"}
    >
      {/* The accessible name has to contain the visible text, so it is built
          from a hidden prefix plus the label rather than an aria-label that
          replaces it. */}
      <span className="sr-only">Tema:</span>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.knob} data-position={theme === "dark" ? "right" : "left"} />
      </span>
      <span className={`mono ${styles.label}`}>{theme === "dark" ? "Noche" : "Día"}</span>
    </button>
  );
}
