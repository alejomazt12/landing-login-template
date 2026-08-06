import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { brands, formatPrice, getBrand, stockLevel, totalUnits } from "@/data/catalog";

type Props = {
  params: Promise<{ brand: string }>;
};

export function generateStaticParams() {
  return brands.map((brand) => ({ brand: brand.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: slug } = await params;
  const brand = getBrand(slug);

  if (!brand) {
    return { title: "Marca no encontrada" };
  }

  return {
    title: `${brand.name} · Disponibilidad`,
    description: `Unidades disponibles de ${brand.name}: ${brand.tagline}.`,
    alternates: { canonical: `/brands/${brand.slug}` },
  };
}

const STOCK_LABELS = {
  "in-stock": "Disponible",
  "low-stock": "Últimas unidades",
  "sold-out": "Agotado",
} as const;

const STOCK_STYLES = {
  "in-stock": "text-success",
  "low-stock": "text-warning",
  "sold-out": "text-danger",
} as const;

export default async function BrandPage({ params }: Props) {
  const { brand: slug } = await params;
  const brand = getBrand(slug);

  if (!brand) {
    notFound();
  }

  const units = totalUnits(brand);
  const maxUnits = Math.max(...brand.products.map((product) => product.units), 1);

  const productsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Productos ${brand.name}`,
    itemListElement: brand.products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: `${product.name} ${product.variant}`,
        brand: { "@type": "Brand", name: brand.name },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "COP",
          availability:
            product.units > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      },
    })),
  };

  return (
    <>
      <SiteHeader />

      <main
        className="page-container"
        style={{ "--brand": brand.color } as React.CSSProperties}
      >
        <nav className="pt-8.5">
          <Link
            href="/"
            className="font-mono text-xs tracking-[0.12em] uppercase text-ink-subtle transition-colors duration-200 ease-board hover:text-ink"
          >
            ← Todas las marcas
          </Link>
        </nav>

        <header className="flex flex-wrap items-start justify-between gap-7 border-b-[3px] border-brand pt-8.5 pb-8 sm:items-end">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">{brand.origin}</p>
            <h1 className="text-[clamp(3rem,9vw,6.5rem)] leading-[0.92] tracking-[-0.045em]">
              {brand.name}
            </h1>
            <p className="text-base text-ink-muted">{brand.tagline}</p>
          </div>

          <dl className="flex gap-6 sm:gap-8.5">
            {[
              { label: "Unidades", value: units },
              { label: "Referencias", value: brand.products.length },
            ].map((counter) => (
              <div key={counter.label} className="flex flex-col items-start gap-0.5">
                <dt className="eyebrow">{counter.label}</dt>
                <dd className="brand-ink font-mono text-[34px] leading-none font-medium tracking-[-0.03em] tabular-nums">
                  {counter.value}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <ul className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-px border border-line bg-line">
          {brand.products.map((product) => {
            const level = stockLevel(product.units);

            return (
              <li
                key={product.id}
                className="flex flex-col gap-4.5 bg-surface px-6 pt-6.5 pb-6 transition-colors duration-200 ease-board hover:bg-surface-raised"
              >
                <div className="flex items-start justify-between gap-3.5">
                  <div>
                    <h2 className="text-[26px] tracking-[-0.025em]">{product.name}</h2>
                    <p className="mt-0.75 text-sm text-ink-muted">{product.variant}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border border-current px-2.25 pt-1 pb-0.75 font-mono text-[10px] font-medium tracking-[0.1em] whitespace-nowrap uppercase ${STOCK_STYLES[level]}`}
                  >
                    {STOCK_LABELS[level]}
                  </span>
                </div>

                <ul className="flex flex-wrap gap-1.5">
                  {[product.year, product.transmission, product.fuel].map((chip) => (
                    <li
                      key={String(chip)}
                      className="rounded-[3px] border border-line bg-canvas-alt px-2 pt-0.75 pb-0.5 font-mono text-[11px] text-ink-muted"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-end justify-between gap-4 pt-1.5">
                  <div
                    role="img"
                    aria-label={`${product.units} unidades disponibles`}
                    className="flex max-w-[60%] flex-wrap gap-1"
                  >
                    {Array.from({ length: maxUnits }, (_, index) => (
                      <span
                        key={index}
                        className={`h-5.5 w-2.5 rounded-[1px] border ${
                          index < product.units
                            ? "border-brand bg-brand"
                            : "border-line-strong bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="flex items-baseline gap-1.5 font-mono tabular-nums">
                    <span className="text-[28px] leading-none font-medium tracking-[-0.03em]">
                      {product.units}
                    </span>
                    <span className="text-[11px] tracking-[0.12em] uppercase text-ink-subtle">
                      {product.units === 1 ? "unidad" : "unidades"}
                    </span>
                  </p>
                </div>

                <div className="border-t border-line pt-4">
                  <p className="font-mono text-lg font-medium tracking-[-0.01em] tabular-nums">
                    {formatPrice(product.price)}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-ink-subtle">Precio de lista</p>
                </div>
              </li>
            );
          })}
        </ul>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd) }}
      />
    </>
  );
}
