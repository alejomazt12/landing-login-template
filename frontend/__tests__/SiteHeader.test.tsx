import { render, screen, within } from "@testing-library/react";

import SiteHeader from "@/components/SiteHeader";

// The header renders the theme toggle, which reads the OS preference.
beforeAll(() => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    media: query,
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
});

describe("SiteHeader site selector", () => {
  it("names the car site by default", () => {
    render(<SiteHeader />);

    expect(screen.getByText(/sitio:/i).parentElement).toHaveTextContent("Carros");
  });

  it("lists every site with a link to its landing page", () => {
    render(<SiteHeader />);

    const list = within(screen.getByRole("list"));

    expect(list.getByRole("link", { name: /carros/i })).toHaveAttribute("href", "/");
    expect(list.getByRole("link", { name: /lavandería/i })).toHaveAttribute(
      "href",
      "/lavanderia",
    );
  });

  it("marks the site the page belongs to as current", () => {
    render(<SiteHeader site="lavanderia" />);

    const list = within(screen.getByRole("list"));

    expect(list.getByRole("link", { name: /lavandería/i })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(list.getByRole("link", { name: /carros/i })).not.toHaveAttribute("aria-current");
  });

  it("points the home badge at the current site", () => {
    render(<SiteHeader site="lavanderia" />);

    expect(screen.getByRole("link", { name: /inicio de lavandería/i })).toHaveAttribute(
      "href",
      "/lavanderia",
    );
  });
});
