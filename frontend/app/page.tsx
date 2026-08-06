import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { brands, totalUnits } from "@/data/catalog";

import styles from "./page.module.css";

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

      <main className="container">
        <section className={styles.hero}>
          <p className="eyebrow">Catálogo · Corte de hoy</p>
          <h1 className={styles.headline}>
            Qué hay <em>disponible</em> ahora mismo
          </h1>
          <p className={styles.lede}>
            Escoge una marca y mira el conteo real de unidades por versión, con precio,
            año y caja. Lo que aparece en cero ya salió del inventario.
          </p>

          <dl className={styles.summary}>
            <div className={styles.stat}>
              <dt className="eyebrow">Marcas</dt>
              <dd className={`mono ${styles.statValue}`}>{brands.length}</dd>
            </div>
            <div className={styles.stat}>
              <dt className="eyebrow">Referencias</dt>
              <dd className={`mono ${styles.statValue}`}>{productCount}</dd>
            </div>
            <div className={styles.stat}>
              <dt className="eyebrow">Unidades</dt>
              <dd className={`mono ${styles.statValue}`}>{unitCount}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="brands-heading">
          <h2 id="brands-heading" className={styles.sectionTitle}>
            Marcas
          </h2>

          <ul className={styles.board}>
            {brands.map((brand) => {
              const units = totalUnits(brand);
              const soldOut = brand.products.filter((product) => product.units === 0).length;

              return (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className={styles.brandRow}
                    style={{ "--brand": brand.color } as React.CSSProperties}
                  >
                    <span className={styles.stripe} aria-hidden="true" />

                    <span className={styles.brandNameBlock}>
                      <span className={styles.brandName}>{brand.name}</span>
                      <span className={styles.tagline}>{brand.tagline}</span>
                    </span>

                    <span className={styles.metaBlock}>
                      <span className={`mono ${styles.metaLine}`}>{brand.origin}</span>
                      <span className={`mono ${styles.metaLine}`}>
                        {brand.products.length} referencias
                        {soldOut > 0 ? ` · ${soldOut} agotada` : ""}
                      </span>
                    </span>

                    <span className={styles.countBlock}>
                      <span className={`mono ${styles.count}`}>
                        {String(units).padStart(2, "0")}
                      </span>
                      <span className="eyebrow">unidades</span>
                    </span>

                    <span className={`mono ${styles.action}`} aria-hidden="true">
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
