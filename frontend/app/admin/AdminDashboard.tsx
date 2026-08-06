"use client";

import { useMemo, useState } from "react";

import { formatPrice, stockLevel, type Brand } from "@/data/catalog";

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

const STOCK_STYLES = {
  "in-stock": "text-success",
  "low-stock": "text-warning",
  "sold-out": "text-danger",
} as const;

const INPUT_CLASS =
  "w-full rounded-[3px] border border-line-strong bg-canvas-alt px-2.75 py-2.5 font-body text-sm text-ink transition-colors duration-200 ease-board outline-none focus:border-accent";
const SUBMIT_CLASS =
  "mt-1 cursor-pointer rounded-[3px] bg-accent px-3.5 py-2.75 font-display text-sm font-bold text-canvas transition-opacity duration-200 ease-board hover:opacity-88";
const CELL_CLASS = "border-b border-line px-4.5 py-2.75 whitespace-nowrap";
const FORM_CLASS =
  "flex flex-col gap-3.5 rounded-[3px] border border-line bg-surface px-5 pt-5.5 pb-5";
const FORM_TITLE_CLASS =
  "text-[13px] font-semibold tracking-[0.18em] uppercase text-ink-subtle";

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
    <div className="flex flex-col gap-7 pt-7 pb-20">
      <dl className="flex flex-wrap rounded-[3px] border border-line bg-surface">
        {[
          { label: "Marcas", value: totals.brands },
          { label: "Productos", value: totals.products },
          { label: "Unidades", value: totals.units },
        ].map((total) => (
          <div
            key={total.label}
            className="flex-1 basis-35 border-r border-line px-4.5 pt-3.5 pb-3 last:border-r-0"
          >
            <dt className="eyebrow">{total.label}</dt>
            <dd className="mt-0.75 font-mono text-[26px] font-medium tracking-[-0.02em] tabular-nums">
              {total.value}
            </dd>
          </div>
        ))}
      </dl>

      {message ? (
        <p
          role="status"
          className="rounded-[3px] border border-accent bg-accent/10 px-3.5 py-2.5 text-[13.5px]"
        >
          {message}
        </p>
      ) : null}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        <form onSubmit={addBrand} noValidate className={FORM_CLASS}>
          <h2 className={FORM_TITLE_CLASS}>Nueva marca</h2>

          <label className="flex flex-col gap-1.25">
            <span className="eyebrow">Nombre</span>
            <input
              className={INPUT_CLASS}
              value={brandDraft.name}
              onChange={(e) => setBrandDraft({ ...brandDraft, name: e.target.value })}
              placeholder="Ej. Nissan"
              required
            />
          </label>

          <label className="flex flex-col gap-1.25">
            <span className="eyebrow">Descripción corta</span>
            <input
              className={INPUT_CLASS}
              value={brandDraft.tagline}
              onChange={(e) => setBrandDraft({ ...brandDraft, tagline: e.target.value })}
              placeholder="Ej. Camionetas y utilitarios"
            />
          </label>

          <label className="flex flex-col gap-1.25">
            <span className="eyebrow">Color de la marca</span>
            <input
              type="color"
              className="h-8.5 w-16 cursor-pointer rounded-[3px] border border-line-strong bg-canvas-alt p-0.5"
              value={brandDraft.color}
              onChange={(e) => setBrandDraft({ ...brandDraft, color: e.target.value })}
            />
          </label>

          <button type="submit" className={SUBMIT_CLASS}>
            Agregar marca
          </button>
        </form>

        <form onSubmit={addProduct} noValidate className={FORM_CLASS}>
          <h2 className={FORM_TITLE_CLASS}>Nuevo producto</h2>

          <label className="flex flex-col gap-1.25">
            <span className="eyebrow">Marca</span>
            <select
              className={INPUT_CLASS}
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

          <label className="flex flex-col gap-1.25">
            <span className="eyebrow">Nombre</span>
            <input
              className={INPUT_CLASS}
              value={productDraft.name}
              onChange={(e) => setProductDraft({ ...productDraft, name: e.target.value })}
              placeholder="Ej. Sentra"
              required
            />
          </label>

          <label className="flex flex-col gap-1.25">
            <span className="eyebrow">Versión</span>
            <input
              className={INPUT_CLASS}
              value={productDraft.variant}
              onChange={(e) => setProductDraft({ ...productDraft, variant: e.target.value })}
              placeholder="Ej. Advance"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.25">
              <span className="eyebrow">Precio</span>
              <input
                type="number"
                min="0"
                step="1000"
                className={`${INPUT_CLASS} font-mono tabular-nums`}
                value={productDraft.price}
                onChange={(e) => setProductDraft({ ...productDraft, price: e.target.value })}
                placeholder="0"
                required
              />
            </label>

            <label className="flex flex-col gap-1.25">
              <span className="eyebrow">Unidades</span>
              <input
                type="number"
                min="0"
                step="1"
                className={`${INPUT_CLASS} font-mono tabular-nums`}
                value={productDraft.units}
                onChange={(e) => setProductDraft({ ...productDraft, units: e.target.value })}
                placeholder="0"
                required
              />
            </label>
          </div>

          <button type="submit" className={SUBMIT_CLASS}>
            Agregar producto
          </button>
        </form>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className={FORM_TITLE_CLASS}>Inventario</h2>

        {brands.map((brand) => (
          <article
            key={brand.slug}
            className="overflow-hidden rounded-[3px] border border-line bg-surface"
          >
            <header
              className="flex items-center gap-3 border-b border-line px-4.5 py-3.5"
              style={{ "--brand": brand.color } as React.CSSProperties}
            >
              <span aria-hidden="true" className="size-2.5 rounded-[2px] bg-brand" />
              <h3 className="text-lg tracking-[-0.02em]">{brand.name}</h3>
              <span className="ml-auto font-mono text-[11px] tracking-[0.1em] uppercase text-ink-subtle">
                {brand.products.length} referencias
              </span>
            </header>

            {brand.products.length === 0 ? (
              <p className="p-4.5 text-[13.5px] text-ink-subtle">
                Todavía no hay productos en esta marca.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-subtle">
                      <th className={`${CELL_CLASS} text-left font-normal`}>Producto</th>
                      <th className={`${CELL_CLASS} text-left font-normal`}>Estado</th>
                      <th className={`${CELL_CLASS} text-right font-normal`}>Precio</th>
                      <th className={`${CELL_CLASS} text-right font-normal`}>Unidades</th>
                      <th className={`${CELL_CLASS} text-right font-normal`}>
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&>tr:last-child>td]:border-b-0">
                    {brand.products.map((product) => (
                      <tr key={product.id}>
                        <td className={`${CELL_CLASS} text-left`}>
                          {product.name}
                          {product.variant ? (
                            <span className="text-ink-subtle"> {product.variant}</span>
                          ) : null}
                        </td>
                        <td className={`${CELL_CLASS} text-left`}>
                          <span
                            className={`rounded-full border border-current px-2 pt-0.75 pb-0.5 font-mono text-[10px] tracking-[0.08em] uppercase ${
                              STOCK_STYLES[stockLevel(product.units)]
                            }`}
                          >
                            {STOCK_LABELS[stockLevel(product.units)]}
                          </span>
                        </td>
                        <td className={`${CELL_CLASS} text-right font-mono tabular-nums`}>
                          {formatPrice(product.price)}
                        </td>
                        <td className={`${CELL_CLASS} text-right font-mono tabular-nums`}>
                          {product.units}
                        </td>
                        <td className={`${CELL_CLASS} text-right`}>
                          <button
                            type="button"
                            onClick={() => removeProduct(brand.slug, product.id)}
                            className="cursor-pointer rounded-[3px] border border-line px-2.25 py-1 font-mono text-[11px] text-ink-subtle transition-colors duration-200 ease-board hover:border-danger hover:text-danger"
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
