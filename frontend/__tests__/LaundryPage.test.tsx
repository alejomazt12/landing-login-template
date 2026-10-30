import { render, screen } from "@testing-library/react";

import LaundryPage from "@/app/lavanderia/page";
import { faqs, services } from "@/data/laundry";

beforeAll(() => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    media: query,
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
});

describe("LaundryPage", () => {
  beforeEach(() => {
    render(<LaundryPage />);
  });

  it("leads with the home delivery promise", () => {
    expect(
      screen.getByRole("heading", { level: 1, name: /tu ropa lista, sin salir de casa/i }),
    ).toBeInTheDocument();
  });

  it("shows every service with its turnaround", () => {
    for (const service of services) {
      const heading = screen.getByRole("heading", { level: 3, name: service.name });
      const card = heading.closest("li")!;

      expect(card).toHaveTextContent(`Listo en ${service.turnaround}`);
    }
  });

  it("explains the three steps in order", () => {
    const steps = screen.getByRole("heading", { name: /tres pasos/i }).closest("section")!;
    const titles = Array.from(steps.querySelectorAll("li h3"), (node) => node.textContent);

    expect(titles).toEqual(["Agenda", "Recogemos", "Te la devolvemos"]);
  });

  it("answers every frequent question", () => {
    for (const faq of faqs) {
      expect(screen.getByText(faq.question)).toBeInTheDocument();
    }
  });

  it("offers nothing to submit, since the site stores no data", () => {
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("selects the laundry site in the header", () => {
    expect(screen.getByRole("link", { name: /lavandería/i, current: true })).toHaveAttribute(
      "href",
      "/lavanderia",
    );
  });

  it("leaves the car admin link out of the footer", () => {
    expect(screen.queryByRole("link", { name: /ingresar al panel/i })).not.toBeInTheDocument();
  });
});
