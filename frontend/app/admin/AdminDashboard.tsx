"use client";

import { useMemo, useState } from "react";

import { formatPrice, stockLevel, type Brand } from "@/data/catalog";

import styles from "./admin.module.css";

type Props = {
  initialBrands: Brand[];
};

type ProductDraft = {
  brandSlug: string;
  name: string;
  variant: string;
  price: string;
  units: string;
};

const EMPTY_BRAND = { name: "", tagline: "", color: "#f2a63c" };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const STOCK_LABELS = {
  "in-stock": "Disponible",
  "low-stock": "Últimas",
  "sold-out": "Agotado",
} as const;

/**
 * Brand and product management.
 *
 * State lives in this component: Postgres only holds `users` in this template.
 * Replacing `setBrands` with API calls is the intended next step — the shapes
 * already match `data/catalog.ts`.
 */
export default function AdminDashboard({ initialBrands }: Props) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [brandDraft, setBrandDraft] = useState(EMPTY_BRAND);
  const [productDraft, setProductDraft] = useState<ProductDraft>({
    brandSlug: initialBrands[0]?.slug ?? "",
    name: "",
    variant: "",
    price: "",
    units: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  const totals = useMemo(
    () => ({
      brands: brands.length,
      products: brands.reduce((sum, brand) => sum + brand.products.length, 0),
      units: brands.reduce(
        (sum, brand) => sum + brand.products.reduce((count, p) => count + p.units, 0),
        0,
      ),
    }),
    [brands],
  );

  function addBrand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const slug = slugify(brandDraft.name);

    if (!slug) {
      setMessage("La marca necesita un nombre.");
      return;
    }

    if (brands.some((brand) => brand.slug === slug)) {
      setMessage(`Ya existe una marca llamada ${brandDraft.name}.`);
      return;
    }

    setBrands((current) => [
      ...current,
      {
        slug,
        name: brandDraft.name.trim(),
        origin: "",
        tagline: brandDraft.tagline.trim(),
        color: brandDraft.color,
        products: [],
      },
    ]);
    setProductDraft((current) => (current.brandSlug ? current : { ...current, brandSlug: slug }));
    setBrandDraft(EMPTY_BRAND);
    setMessage(`Marca ${brandDraft.name} agregada.`);
  }

  function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const units = Number(productDraft.units);
    const price = Number(productDraft.price);

    if (!productDraft.brandSlug) {
      setMessage("Primero agrega una marca.");
      return;
    }

    if (!productDraft.name.trim()) {
      setMessage("El producto necesita un nombre.");
      return;
    }

    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(units) || units < 0) {
      setMessage("Revisa el precio y las unidades: deben ser números positivos.");
      return;
    }

    setBrands((current) =>
      current.map((brand) =>
        brand.slug !== productDraft.brandSlug
          ? brand
          : {
              ...brand,
              products: [
                ...brand.products,
                {
                  id: `${brand.slug}-${slugify(productDraft.name)}-${brand.products.length}`,
                  name: productDraft.name.trim(),
                  variant: productDraft.variant.trim(),
                  year: new Date().getFullYear(),
                  transmission: "—",
                  fuel: "—",
                  price,
                  units,
                },
              ],
            },
      ),
    );

    // Brand stays selected so several products in a row take fewer clicks.
    setProductDraft((current) => ({ ...current, name: "", variant: "", price: "", units: "" }));
    setMessage(`Producto ${productDraft.name} agregado.`);
  }

  function removeProduct(brandSlug: string, productId: string) {
    setBrands((current) =>
      current.map((brand) =>
        brand.slug !== brandSlug
          ? brand
          : { ...brand, products: brand.products.filter((p) => p.id !== productId) },
      ),
    );
    setMessage("Producto eliminado.");
  }

  return (
    <div className={styles.dashboard}>
      <dl className={styles.totals}>
        <div className={styles.total}>
          <dt className="eyebrow">Marcas</dt>
          <dd className={`mono ${styles.totalValue}`}>{totals.brands}</dd>
        </div>
        <div className={styles.total}>
          <dt className="eyebrow">Productos</dt>
          <dd className={`mono ${styles.totalValue}`}>{totals.products}</dd>
        </div>
        <div className={styles.total}>
          <dt className="eyebrow">Unidades</dt>
          <dd className={`mono ${styles.totalValue}`}>{totals.units}</dd>
        </div>
      </dl>

      {message ? (
        <p className={styles.message} role="status">
          {message}
        </p>
      ) : null}

      <div className={styles.forms}>
        <form className={styles.form} onSubmit={addBrand} noValidate>
          <h2 className={styles.formTitle}>Nueva marca</h2>

          <label className={styles.field}>
            <span className="eyebrow">Nombre</span>
            <input
              className={styles.input}
              value={brandDraft.name}
              onChange={(e) => setBrandDraft({ ...brandDraft, name: e.target.value })}
              placeholder="Ej. Nissan"
              required
            />
          </label>

          <label className={styles.field}>
            <span className="eyebrow">Descripción corta</span>
            <input
              className={styles.input}
              value={brandDraft.tagline}
              onChange={(e) => setBrandDraft({ ...brandDraft, tagline: e.target.value })}
              placeholder="Ej. Camionetas y utilitarios"
            />
          </label>

          <label className={styles.field}>
            <span className="eyebrow">Color de la marca</span>
            <input
              type="color"
              className={styles.color}
              value={brandDraft.color}
              onChange={(e) => setBrandDraft({ ...brandDraft, color: e.target.value })}
            />
          </label>

          <button type="submit" className={styles.submit}>
            Agregar marca
          </button>
        </form>

        <form className={styles.form} onSubmit={addProduct} noValidate>
          <h2 className={styles.formTitle}>Nuevo producto</h2>

          <label className={styles.field}>
            <span className="eyebrow">Marca</span>
            <select
              className={styles.input}
              value={productDraft.brandSlug}
              onChange={(e) => setProductDraft({ ...productDraft, brandSlug: e.target.value })}
            >
              {brands.map((brand) => (
                <option key={brand.slug} value={brand.slug}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className="eyebrow">Nombre</span>
            <input
              className={styles.input}
              value={productDraft.name}
              onChange={(e) => setProductDraft({ ...productDraft, name: e.target.value })}
              placeholder="Ej. Sentra"
              required
            />
          </label>

          <label className={styles.field}>
            <span className="eyebrow">Versión</span>
            <input
              className={styles.input}
              value={productDraft.variant}
              onChange={(e) => setProductDraft({ ...productDraft, variant: e.target.value })}
              placeholder="Ej. Advance"
            />
          </label>

          <div className={styles.pair}>
            <label className={styles.field}>
              <span className="eyebrow">Precio</span>
              <input
                type="number"
                min="0"
                step="1000"
                className={`mono ${styles.input}`}
                value={productDraft.price}
                onChange={(e) => setProductDraft({ ...productDraft, price: e.target.value })}
                placeholder="0"
                required
              />
            </label>

            <label className={styles.field}>
              <span className="eyebrow">Unidades</span>
              <input
                type="number"
                min="0"
                step="1"
                className={`mono ${styles.input}`}
                value={productDraft.units}
                onChange={(e) => setProductDraft({ ...productDraft, units: e.target.value })}
                placeholder="0"
                required
              />
            </label>
          </div>

          <button type="submit" className={styles.submit}>
            Agregar producto
          </button>
        </form>
      </div>

      <section className={styles.inventory}>
        <h2 className={styles.formTitle}>Inventario</h2>

        {brands.map((brand) => (
          <article key={brand.slug} className={styles.brandGroup}>
            <header
              className={styles.brandHeader}
              style={{ "--brand": brand.color } as React.CSSProperties}
            >
              <span className={styles.brandSwatch} aria-hidden="true" />
              <h3 className={styles.brandName}>{brand.name}</h3>
              <span className={`mono ${styles.brandCount}`}>
                {brand.products.length} referencias
              </span>
            </header>

            {brand.products.length === 0 ? (
              <p className={styles.empty}>Todavía no hay productos en esta marca.</p>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Estado</th>
                      <th className={styles.numeric}>Precio</th>
                      <th className={styles.numeric}>Unidades</th>
                      <th>
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {brand.products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          {product.name}
                          {product.variant ? (
                            <span className={styles.variant}> {product.variant}</span>
                          ) : null}
                        </td>
                        <td>
                          <span
                            className={`mono ${styles.badge}`}
                            data-level={stockLevel(product.units)}
                          >
                            {STOCK_LABELS[stockLevel(product.units)]}
                          </span>
                        </td>
                        <td className={`mono ${styles.numeric}`}>{formatPrice(product.price)}</td>
                        <td className={`mono ${styles.numeric}`}>{product.units}</td>
                        <td className={styles.numeric}>
                          <button
                            type="button"
                            className={styles.remove}
                            onClick={() => removeProduct(brand.slug, product.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
