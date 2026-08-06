import Link from "next/link";

import ThemeToggle from "./ThemeToggle";

type Props = {
  /** Rendered on the right side, before the theme toggle. */
  action?: React.ReactNode;
};

export default function SiteHeader({ action }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/90 backdrop-blur-[10px]">
      <div className="page-container flex min-h-[68px] items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3.5">
          <span className="rounded-[3px] border border-line-strong bg-surface-raised px-2.5 pt-1.5 pb-1 font-mono text-xs font-semibold tracking-[0.1em] whitespace-nowrap text-ink-muted">
            TP · 3030
          </span>
          <span className="flex flex-col font-display text-[15px] leading-[1.1] font-bold tracking-[-0.015em] sm:text-[17px]">
            Template App
            <span className="font-mono text-[10.5px] font-normal tracking-[0.16em] uppercase text-ink-subtle">
              Catálogo y disponibilidad
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3.5">
          {action}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
