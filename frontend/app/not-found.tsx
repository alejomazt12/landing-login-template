import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main className="page-container pt-27 pb-22">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3.5 text-[clamp(2.4rem,6vw,4rem)] tracking-[-0.035em]">
          Esta página no existe
        </h1>
        <p className="mt-4 max-w-[50ch] text-ink-muted">
          Revisa el enlace o vuelve al catálogo para ver las marcas disponibles.
        </p>
        <Link
          href="/"
          className="mt-7 inline-block rounded-[3px] border border-line-strong px-4 py-2.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors duration-200 ease-board hover:border-accent"
        >
          ← Volver al catálogo
        </Link>
      </main>
    </>
  );
}
