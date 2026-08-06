import { fireEvent, render, screen, within } from "@testing-library/react";

import AdminDashboard from "@/app/admin/AdminDashboard";
import type { Brand } from "@/data/catalog";

const BRANDS: Brand[] = [
  {
    slug: "mazda",
    name: "Mazda",
    origin: "Hiroshima",
    tagline: "Diseño Kodo",
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
    ],
  },
];

function renderDashboard() {
  return render(<AdminDashboard initialBrands={BRANDS} />);
}

function addBrand(name: string) {
  fireEvent.change(screen.getByPlaceholderText("Ej. Nissan"), { target: { value: name } });
  fireEvent.click(screen.getByRole("button", { name: "Agregar marca" }));
}

function addProduct(name: string, price: string, units: string) {
  fireEvent.change(screen.getByPlaceholderText("Ej. Sentra"), { target: { value: name } });
  fireEvent.change(screen.getByLabelText("Precio"), { target: { value: price } });
  fireEvent.change(screen.getByLabelText("Unidades"), { target: { value: units } });
  fireEvent.click(screen.getByRole("button", { name: "Agregar producto" }));
}

describe("AdminDashboard", () => {
  it("lists the initial catalog", () => {
    renderDashboard();

    expect(screen.getByRole("heading", { name: "Mazda", level: 3 })).toBeInTheDocument();
    expect(screen.getByText("1 referencias")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: /Mazda 3/ })).toBeInTheDocument();
  });

  it("adds a brand and lists it in the inventory", () => {
    renderDashboard();

    addBrand("Nissan");

    expect(screen.getByRole("heading", { name: "Nissan", level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Marca Nissan agregada.");
  });

  it("rejects a duplicated brand", () => {
    renderDashboard();

    addBrand("Mazda");

    expect(screen.getByRole("status")).toHaveTextContent("Ya existe una marca llamada Mazda.");
  });

  it("rejects a brand whose name is only whitespace", () => {
    renderDashboard();

    addBrand("   ");

    expect(screen.getByRole("status")).toHaveTextContent("La marca necesita un nombre.");
  });

  it("adds a product to the selected brand", () => {
    renderDashboard();

    addProduct("Mazda 6", "180000000", "4");

    expect(screen.getByRole("status")).toHaveTextContent("Producto Mazda 6 agregado.");
    expect(screen.getByRole("cell", { name: /Mazda 6/ })).toBeInTheDocument();
  });

  it("rejects negative units", () => {
    renderDashboard();

    addProduct("Mazda 6", "180000000", "-2");

    expect(screen.getByRole("status")).toHaveTextContent(/deben ser números positivos/);
  });

  it("marks a product with zero units as sold out", () => {
    renderDashboard();

    addProduct("Mazda 6", "180000000", "0");

    const row = screen.getByRole("cell", { name: /Mazda 6/ }).closest("tr")!;
    expect(within(row).getByText("Agotado")).toBeInTheDocument();
  });

  it("removes a product", () => {
    renderDashboard();

    fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);

    expect(screen.getByRole("status")).toHaveTextContent("Producto eliminado.");
    expect(screen.queryByRole("cell", { name: /Mazda 3/ })).not.toBeInTheDocument();
  });
});
