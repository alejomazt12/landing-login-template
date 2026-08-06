import { brands, formatPrice, getBrand, stockLevel, totalUnits } from "@/data/catalog";

describe("getBrand", () => {
  it("finds a brand by slug", () => {
    expect(getBrand("mazda")?.name).toBe("Mazda");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getBrand("does-not-exist")).toBeUndefined();
  });
});

describe("totalUnits", () => {
  it("adds up the units of every product", () => {
    const brand = getBrand("mazda")!;

    expect(totalUnits(brand)).toBe(15);
  });

  it("returns zero for a brand with no products", () => {
    expect(
      totalUnits({
        slug: "empty",
        name: "Empty",
        origin: "",
        tagline: "",
        color: "#000000",
        products: [],
      }),
    ).toBe(0);
  });
});

describe("stockLevel", () => {
  it.each([
    [0, "sold-out"],
    [1, "low-stock"],
    [2, "low-stock"],
    [3, "in-stock"],
    [10, "in-stock"],
  ])("maps %i units to %s", (units, expected) => {
    expect(stockLevel(units)).toBe(expected);
  });
});

describe("formatPrice", () => {
  it("formats as Colombian pesos with no decimals", () => {
    const formatted = formatPrice(132900000);

    expect(formatted).toContain("132.900.000");
    expect(formatted).not.toContain(",00");
  });
});

describe("catalog data", () => {
  it("has unique brand slugs", () => {
    const slugs = brands.map((brand) => brand.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique product ids across every brand", () => {
    const ids = brands.flatMap((brand) => brand.products.map((product) => product.id));

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never carries negative units or prices", () => {
    for (const brand of brands) {
      for (const product of brand.products) {
        expect(product.units).toBeGreaterThanOrEqual(0);
        expect(product.price).toBeGreaterThan(0);
      }
    }
  });
});
