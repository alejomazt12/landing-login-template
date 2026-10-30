import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { brands, totalUnits } from "@/data/catalog";

/**
 * Landing page.
 *
 * Fully static: no data fetching at request time, no client components beyond
 * the theme toggle. That is what keeps the Lighthouse numbers where they are.
 *
 * The hero loop is decoration layered over a still frame of itself, so the
 * page carries its meaning without it: phones, reduced-motion visitors and
 * anyone whose video fails to load all see the poster instead.
 */
export const dynamic = "force-static";

const HERO_POSTER_WIDTH = 1600;
const HERO_POSTER_HEIGHT = 900;

export default function HomePage() {
  const unitCount = brands.reduce((sum, brand) => sum + totalUnits(brand), 0);
  const productCount = brands.reduce((sum, brand) => sum + brand.products.length, 0);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Marcas disponibles",
    itemListElement: brands.map((brand, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: brand.name,
      url: `/brands/${brand.slug}`,
    })),
  };

  return (
    <>
      <SiteHeader overlay />

      <main>
        <section
          aria-labelledby="hero-heading"
          className="on-hero relative isolate flex min-h-[clamp(34rem,100svh,52rem)] flex-col overflow-hidden"
        >
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <Image
              src="/hero-poster.jpg"
              alt=""
              width={HERO_POSTER_WIDTH}
              height={HERO_POSTER_HEIGHT}
              priority
              sizes="100vw"
              className="size-full object-cover"
            />
            {/* Desktop only, and only where the visitor has not asked for less
                motion. The still above shows through until a frame decodes, so
                there is nothing to fall back to. */}
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="absolute inset-0 hidden size-full object-cover md:[@media(prefers-reduced-motion:no-preference)]:block"
            >
              <source src="/hero-loop.mp4" type="video/mp4" />
            </video>
            <div className="hero-veil absolute inset-0" />
            {/* The header has no bar of its own, so this is what keeps it
                legible when a bright frame drifts under it. */}
            <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-hero-veil/75 to-transparent" />
          </div>

          <div className="page-container flex flex-1 flex-col justify-center pt-28 pb-14 md:pt-32">
            <p className="eyebrow">Catálogo · Corte de hoy</p>
            <h1
              id="hero-heading"
              className="mt-4.5 max-w-[17ch] text-[clamp(2.6rem,7vw,5.4rem)] tracking-[-0.035em] text-ink"
            >
              Qué hay <em className="not-italic text-accent">disponible</em> ahora mismo
            </h1>
            <p className="mt-5.5 max-w-[52ch] text-[17px] text-ink-muted">
              Escoge una marca y mira el conteo real de unidades por versión, con precio,
              año y caja. Lo que aparece en cero ya salió del inventario.
            </p>
            <Link
              href="#marcas"
              className="mt-9 inline-flex w-fit items-center gap-3 rounded-[3px] bg-accent px-6 py-3.5 font-mono text-xs font-semibold tracking-[0.14em] uppercase text-hero-veil transition-colors duration-200 ease-board hover:bg-hero-accent-hover"
            >
              Ver las marcas →
            </Link>
          </div>

          <div className="border-t border-line bg-hero-veil/55">
            <dl className="page-container flex flex-wrap py-4.5">
              {[
                { label: "Marcas", value: brands.length },
                { label: "Referencias", value: productCount },
                { label: "Unidades", value: unitCount },
              ].map((stat) => (
                <div key={stat.label} className="flex-1 basis-30">
                  <dt className="eyebrow">{stat.label}</dt>
                  <dd className="mt-0.5 font-mono text-2xl font-medium tracking-[-0.02em] tabular-nums text-ink">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Dissolves the hero into the page instead of cutting it off, which on
            light was a near-black rail meeting beige at a hard line. */}
        <div aria-hidden="true" className="hero-hem h-24" />

        <section
          id="marcas"
          aria-labelledby="brands-heading"
          className="page-container pt-10"
        >
          <h2
            id="brands-heading"
            className="mb-4.5 text-[13px] font-semibold tracking-[0.2em] uppercase text-ink-subtle"
          >
            Marcas
          </h2>

          <ul className="flex flex-col gap-2.5">
            {brands.map((brand) => {
              const units = totalUnits(brand);
              const soldOut = brand.products.filter((product) => product.units === 0).length;

              return (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    style={{ "--brand": brand.color } as React.CSSProperties}
                    className="group grid grid-cols-[8px_minmax(0,1fr)_auto] items-center gap-4 overflow-hidden rounded-[3px] border border-line bg-surface py-5 pr-5 transition-colors duration-200 ease-board hover:border-line-strong hover:bg-surface-raised md:grid-cols-[8px_minmax(0,1.15fr)_minmax(0,1fr)_auto_auto] md:gap-7 md:py-6.5 md:pr-6.5"
                  >
                    <span
                      aria-hidden="true"
                      className="-my-5 w-2 self-stretch bg-brand transition-[width] duration-200 ease-board group-hover:w-4 md:-my-6.5"
                    />

                    <span className="flex flex-col gap-1 pl-4.5 transition-transform duration-200 ease-board group-hover:translate-x-2">
                      <span className="font-display text-[clamp(2rem,4.4vw,3.1rem)] leading-none font-bold tracking-[-0.035em]">
                        {brand.name}
                      </span>
                      <span className="text-sm text-ink-muted">{brand.tagline}</span>
                    </span>

                    <span className="hidden flex-col gap-0.75 md:flex">
                      <span className="font-mono text-xs text-ink-subtle">{brand.origin}</span>
                      <span className="font-mono text-xs text-ink-subtle">
                        {brand.products.length} referencias
                        {soldOut > 0 ? ` · ${soldOut} agotada` : ""}
                      </span>
                    </span>

                    <span className="flex flex-col items-end gap-0.5 border-l border-line pl-4.5">
                      <span className="brand-ink font-mono text-[40px] leading-none font-medium tracking-[-0.03em] tabular-nums">
                        {String(units).padStart(2, "0")}
                      </span>
                      <span className="eyebrow">unidades</span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="hidden font-mono text-xs tracking-[0.14em] uppercase text-ink-subtle transition-all duration-200 ease-board group-hover:translate-x-1 group-hover:text-ink md:block"
                    >
                      Ver →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </>
  );
}
