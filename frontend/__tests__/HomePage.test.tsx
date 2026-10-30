import { render, screen, within } from "@testing-library/react";

import HomePage from "@/app/page";

/**
 * The header renders ThemeToggle, which reads the OS preference through
 * matchMedia. jsdom does not implement it.
 */
beforeAll(() => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    media: query,
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

describe("HomePage", () => {
  it("leads with the availability headline", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: /disponible ahora mismo/i }),
    ).toBeInTheDocument();
  });

  it("sends the hero call to action down to the brands", () => {
    render(<HomePage />);

    expect(screen.getByRole("link", { name: /ver las marcas/i })).toHaveAttribute(
      "href",
      "#marcas",
    );
  });

  it("totals the catalog in the hero rail", () => {
    render(<HomePage />);

    const rail = screen.getByText("Referencias").closest("dl");

    expect(rail).not.toBeNull();
    expect(within(rail!).getByText("3")).toBeInTheDocument();
    expect(within(rail!).getByText("11")).toBeInTheDocument();
    expect(within(rail!).getByText("50")).toBeInTheDocument();
  });

  it("links every brand to its own page", () => {
    render(<HomePage />);

    expect(screen.getByRole("link", { name: /Mazda/ })).toHaveAttribute("href", "/brands/mazda");
    expect(screen.getByRole("link", { name: /Toyota/ })).toHaveAttribute("href", "/brands/toyota");
    expect(screen.getByRole("link", { name: /Renault/ })).toHaveAttribute(
      "href",
      "/brands/renault",
    );
  });

  /**
   * The loop has no accessible role to query by — it is decoration, and the
   * point of these two tests is that it stays that way: silent, unattended,
   * and absent from the accessibility tree along with the still behind it.
   */
  it("plays the background loop silently and unattended", () => {
    const { container } = render(<HomePage />);

    const video = container.querySelector("video");

    expect(video).not.toBeNull();
    expect(video!.muted).toBe(true);
    expect(video!.loop).toBe(true);
    expect(video!.autoplay).toBe(true);
    expect(video!.controls).toBe(false);
    expect(video).toHaveAttribute("playsinline");
    expect(container.querySelector("video source")).toHaveAttribute("src", "/hero-loop.mp4");
  });

  it("keeps the hero artwork out of the accessibility tree", () => {
    render(<HomePage />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
