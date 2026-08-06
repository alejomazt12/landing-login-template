import Link from "next/link";

import ThemeToggle from "./ThemeToggle";
import styles from "./SiteHeader.module.css";

type Props = {
  /** Rendered on the right side, before the theme toggle. */
  action?: React.ReactNode;
};

export default function SiteHeader({ action }: Props) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.row}`}>
        <Link href="/" className={styles.identity}>
          <span className={`mono ${styles.plate}`}>TP · 3030</span>
          <span className={styles.name}>
            Template App
            <span className={styles.tagline}>Catálogo y disponibilidad</span>
          </span>
        </Link>

        <div className={styles.right}>
          {action}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
