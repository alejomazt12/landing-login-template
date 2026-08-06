import Link from "next/link";

import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.row}`}>
        <p className={styles.note}>
          Catálogo de demostración. Las cantidades y los precios son de prueba.
        </p>
        <Link href="/login" className={`mono ${styles.link}`}>
          Ingresar al panel →
        </Link>
      </div>
    </footer>
  );
}
