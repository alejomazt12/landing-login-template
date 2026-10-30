import Link from "next/link";

type Props = {
  note?: string;
  /** The admin panel manages the car catalog, so other sites leave it out. */
  showPanelLink?: boolean;
};

export default function SiteFooter({
  note = "Catálogo de demostración. Las cantidades y los precios son de prueba.",
  showPanelLink = true,
}: Props) {
  return (
    <footer className="mt-24 border-t border-line bg-canvas-alt">
      <div className="page-container flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pt-6.5 pb-7.5">
        <p className="max-w-[46ch] text-[13.5px] text-ink-subtle">{note}</p>
        {showPanelLink && (
          <Link
            href="/login"
            className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-subtle transition-colors duration-200 ease-board hover:text-ink"
          >
            Ingresar al panel →
          </Link>
        )}
      </div>
    </footer>
  );
}
