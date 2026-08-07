import { act, fireEvent, render, screen } from "@testing-library/react";

import ThemeToggle from "@/components/ThemeToggle";

/**
 * jsdom reports every media query as not matching, so the OS preference has to
 * be stated per test. The listener is kept so a change can be dispatched.
 */
function preferScheme(scheme: "light" | "dark") {
  const listeners = new Set<() => void>();

  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    media: query,
    matches: scheme === "dark",
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }));

  return () => listeners.forEach((listener) => listener());
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    window.localStorage.clear();
  });

  it("shows the theme the inline script already applied", () => {
    document.documentElement.setAttribute("data-theme", "dark");
    preferScheme("light");

    render(<ThemeToggle />);

    expect(screen.getByRole("button", { name: /tema: noche/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("falls back to the system preference when no theme is stored", () => {
    preferScheme("dark");

    render(<ThemeToggle />);

    expect(screen.getByRole("button", { name: /tema: noche/i })).toBeInTheDocument();
  });

  it("stores the theme and repaints the page when toggled", () => {
    preferScheme("light");

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: /tema: día/i }));

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");
    expect(screen.getByRole("button", { name: /tema: noche/i })).toBeInTheDocument();
  });

  it("follows the system preference while no theme has been chosen", () => {
    const emitPreferenceChange = preferScheme("light");

    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: /tema: día/i })).toBeInTheDocument();

    preferScheme("dark");
    // The store notifies outside React's event handlers, so the re-render it
    // schedules has to be flushed before the assertion.
    act(emitPreferenceChange);

    expect(screen.getByRole("button", { name: /tema: noche/i })).toBeInTheDocument();
  });
});
