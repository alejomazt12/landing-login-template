import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { brands, formatPrice, getBrand, stockLevel, totalUnits } from "@/data/catalog";

import styles from "./brand.module.css";

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
        className="container"
        style={{ "--brand": brand.color } as React.CSSProperties}
      >
        <nav className={styles.breadcrumb}>
          <Link href="/" className={`mono ${styles.back}`}>
            ← Todas las marcas
          </Link>
        </nav>

        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <p className="eyebrow">{brand.origin}</p>
            <h1 className={styles.title}>{brand.name}</h1>
            <p className={styles.tagline}>{brand.tagline}</p>
          </div>

          <dl className={styles.counters}>
            <div className={styles.counter}>
              <dt className="eyebrow">Unidades</dt>
              <dd className={`mono ${styles.counterValue}`}>{units}</dd>
            </div>
            <div className={styles.counter}>
              <dt className="eyebrow">Referencias</dt>
              <dd className={`mono ${styles.counterValue}`}>{brand.products.length}</dd>
            </div>
          </dl>
        </header>

        <ul className={styles.list}>
          {brand.products.map((product) => {
            const level = stockLevel(product.units);

            return (
              <li key={product.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h2 className={styles.productName}>{product.name}</h2>
                    <p className={styles.variant}>{product.variant}</p>
                  </div>
                  <span className={`mono ${styles.badge}`} data-level={level}>
                    {STOCK_LABELS[level]}
                  </span>
                </div>

                <ul className={styles.chips}>
                  <li className={`mono ${styles.chip}`}>{product.year}</li>
                  <li className={`mono ${styles.chip}`}>{product.transmission}</li>
                  <li className={`mono ${styles.chip}`}>{product.fuel}</li>
                </ul>

                <div className={styles.meter}>
                  <div
                    className={styles.blocks}
                    role="img"
                    aria-label={`${product.units} unidades disponibles`}
                  >
                    {Array.from({ length: maxUnits }, (_, index) => (
                      <span
                        key={index}
                        className={styles.block}
                        data-filled={index < product.units}
                      />
                    ))}
                  </div>
                  <p className={`mono ${styles.count}`}>
                    <span className={styles.countNumber}>{product.units}</span>
                    <span className={styles.countLabel}>
                      {product.units === 1 ? "unidad" : "unidades"}
                    </span>
                  </p>
                </div>

                <div className={styles.footer}>
                  <p className={`mono ${styles.price}`}>{formatPrice(product.price)}</p>
                  <p className={styles.priceNote}>Precio de lista</p>
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
