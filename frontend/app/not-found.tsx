import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";

import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main className={`container ${styles.main}`}>
        <p className="eyebrow">Error 404</p>
        <h1 className={styles.title}>Esta página no existe</h1>
        <p className={styles.lede}>
          Revisa el enlace o vuelve al catálogo para ver las marcas disponibles.
        </p>
        <Link href="/" className={`mono ${styles.link}`}>
          ← Volver al catálogo
        </Link>
      </main>
    </>
  );
}
