import Link from "next/link";

import { getSite, sites, type SiteId } from "@/data/sites";

import ThemeToggle from "./ThemeToggle";

type Props = {
  /** Rendered on the right side, before the theme toggle. */
  action?: React.ReactNode;
  /** The site the page belongs to. Names the header and marks the selector. */
  site?: SiteId;
};

export default function SiteHeader({ action, site = "carros" }: Props) {
  const current = getSite(site);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/90 backdrop-blur-[10px]">
      <div className="page-container flex min-h-[68px] items-center justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <Link
            href={current.href}
            className="rounded-[3px] border border-line-strong bg-surface-raised px-2.5 pt-1.5 pb-1 font-mono text-xs font-semibold tracking-[0.1em] whitespace-nowrap text-ink-muted"
          >
            <span className="sr-only">Inicio de {current.name}: </span>
            TP · 3030
          </Link>

          {/* A native disclosure keeps the selector free of client JavaScript,
              which the static landing pages depend on. */}
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-[3px] py-1 pr-1 [&::-webkit-details-marker]:hidden">
              <span className="flex flex-col font-display text-[15px] leading-[1.1] font-bold tracking-[-0.015em] sm:text-[17px]">
                <span>
                  <span className="sr-only">Sitio: </span>
                  {current.name}
                </span>
                <span className="font-mono text-[10.5px] font-normal tracking-[0.16em] uppercase text-ink-subtle">
                  {current.tagline}
                </span>
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 text-ink-subtle transition-transform duration-200 ease-board group-open:rotate-180"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>

            <div className="absolute top-[calc(100%+12px)] left-0 z-30 w-64 rounded-md border border-line bg-surface-raised p-1.5 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.45)]">
              <p className="eyebrow px-3 pt-2 pb-1.5">Cambiar de sitio</p>
              <ul>
                {sites.map((item) => {
                  const isCurrent = item.id === current.id;

                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        aria-current={isCurrent ? "true" : undefined}
                        className="flex items-center justify-between gap-3 rounded-[3px] px-3 py-2.5 transition-colors duration-200 ease-board hover:bg-canvas-alt aria-[current=true]:bg-canvas-alt"
                      >
                        <span className="flex flex-col">
                          <span className="font-display text-[15px] font-bold">{item.name}</span>
                          <span className="text-xs text-ink-muted">{item.tagline}</span>
                        </span>
                        {isCurrent && (
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-4 text-accent"
                          >
                            <path d="m5 12.5 4.5 4.5L19 7.5" />
                          </svg>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </details>
        </div>

        <div className="flex items-center gap-3.5">
          {action}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
