/**
 * Demo catalog.
 *
 * Only the `users` table lives in Postgres, so brands and products are served
 * from here. Swapping this module for API calls is the intended next step —
 * every consumer goes through the helpers below rather than the array itself.
 */

export type Product = {
  id: string;
  name: string;
  variant: string;
  year: number;
  transmission: string;
  fuel: string;
  price: number;
  units: number;
};

export type Brand = {
  slug: string;
  name: string;
  origin: string;
  tagline: string;
  color: string;
  products: Product[];
};

export const brands: Brand[] = [
  {
    slug: "mazda",
    name: "Mazda",
    origin: "Hiroshima, Japón",
    tagline: "Ingeniería Skyactiv y diseño Kodo",
    color: "#C0122E",
    products: [
      {
        id: "mazda-3-touring",
        name: "Mazda 3",
        variant: "Touring",
        year: 2025,
        transmission: "Automática",
        fuel: "Gasolina",
        price: 132900000,
        units: 3,
      },
      {
        id: "mazda-cx30-grand-touring",
        name: "Mazda CX-30",
        variant: "Grand Touring",
        year: 2025,
        transmission: "Automática",
        fuel: "Gasolina",
        price: 158900000,
        units: 2,
      },
      {
        id: "mazda-2-touring",
        name: "Mazda 2",
        variant: "Touring",
        year: 2025,
        transmission: "Automática",
        fuel: "Gasolina",
        price: 96500000,
        units: 10,
      },
    ],
  },
  {
    slug: "toyota",
    name: "Toyota",
    origin: "Aichi, Japón",
    tagline: "Fiabilidad probada en cualquier terreno",
    color: "#E8552F",
    products: [
      {
        id: "toyota-corolla-cross-xei",
        name: "Corolla Cross",
        variant: "XEI Híbrida",
        year: 2025,
        transmission: "Automática",
        fuel: "Híbrido",
        price: 174900000,
        units: 4,
      },
      {
        id: "toyota-hilux-sr",
        name: "Hilux 4x4",
        variant: "SR Doble Cabina",
        year: 2025,
        transmission: "Mecánica",
        fuel: "Diésel",
        price: 215400000,
        units: 2,
      },
      {
        id: "toyota-rav4-limited",
        name: "RAV4",
        variant: "Limited",
        year: 2024,
        transmission: "Automática",
        fuel: "Híbrido",
        price: 249900000,
        units: 1,
      },
      {
        id: "toyota-yaris-xli",
        name: "Yaris Sedán",
        variant: "XLI",
        year: 2025,
        transmission: "Mecánica",
        fuel: "Gasolina",
        price: 88900000,
        units: 8,
      },
    ],
  },
  {
    slug: "renault",
    name: "Renault",
    origin: "Boulogne-Billancourt, Francia",
    tagline: "Ensamble nacional y repuestos en plaza",
    color: "#F3D02F",
    products: [
      {
        id: "renault-duster-intens",
        name: "Duster",
        variant: "Intens 4x2",
        year: 2025,
        transmission: "Automática",
        fuel: "Gasolina",
        price: 118700000,
        units: 5,
      },
      {
        id: "renault-kwid-outsider",
        name: "Kwid",
        variant: "Outsider",
        year: 2025,
        transmission: "Mecánica",
        fuel: "Gasolina",
        price: 62300000,
        units: 12,
      },
      {
        id: "renault-logan-zen",
        name: "Logan",
        variant: "Zen",
        year: 2024,
        transmission: "Mecánica",
        fuel: "Gasolina",
        price: 74900000,
        units: 3,
      },
      {
        id: "renault-koleos-iconic",
        name: "Koleos",
        variant: "Iconic",
        year: 2024,
        transmission: "Automática",
        fuel: "Gasolina",
        price: 189500000,
        units: 0,
      },
    ],
  },
];

export function getBrand(slug: string): Brand | undefined {
  return brands.find((brand) => brand.slug === slug);
}

export function totalUnits(brand: Brand): number {
  return brand.products.reduce((sum, product) => sum + product.units, 0);
}

export type StockLevel = "in-stock" | "low-stock" | "sold-out";

export function stockLevel(units: number): StockLevel {
  if (units === 0) return "sold-out";
  if (units <= 2) return "low-stock";
  return "in-stock";
}

const priceFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}
