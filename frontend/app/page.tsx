import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { brands, totalUnits } from "@/data/catalog";

/**
 * Landing page.
 *
 * Fully static: no data fetching at request time, no client components beyond
 * the theme toggle. That is what keeps the Lighthouse numbers where they are.
 */
export const dynamic = "force-static";

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
      <SiteHeader />

      <main className="page-container">
        <section className="border-b border-line pt-13 pb-14 md:pt-21">
          <p className="eyebrow">Catálogo · Corte de hoy</p>
          <h1 className="mt-4.5 text-[clamp(2.6rem,7vw,5.4rem)] tracking-[-0.035em]">
            Qué hay <em className="not-italic text-accent">disponible</em> ahora mismo
          </h1>
          <p className="mt-5.5 max-w-[58ch] text-[17px] text-ink-muted">
            Escoge una marca y mira el conteo real de unidades por versión, con precio,
            año y caja. Lo que aparece en cero ya salió del inventario.
          </p>

          <dl className="mt-11 flex flex-wrap rounded-[3px] border border-line bg-surface">
            {[
              { label: "Marcas", value: brands.length },
              { label: "Referencias", value: productCount },
              { label: "Unidades", value: unitCount },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex-1 basis-35 border-r border-line px-5 pt-4 pb-3.5 last:border-r-0"
              >
                <dt className="eyebrow">{stat.label}</dt>
                <dd className="mt-1 font-mono text-3xl font-medium tracking-[-0.02em] tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="brands-heading">
          <h2
            id="brands-heading"
            className="mt-14 mb-4.5 text-[13px] font-semibold tracking-[0.2em] uppercase text-ink-subtle"
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
