import type { Metadata } from "next";
import { redirect } from "next/navigation";

import SiteHeader from "@/components/SiteHeader";
import { getCurrentUser } from "@/lib/session";

import LoginForm from "./LoginForm";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Acceso al panel de administración.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/admin");
  }

  const { next } = await searchParams;
  // Only same-site paths, so a crafted ?next=https://evil.example cannot turn
  // the login into an open redirect.
  const redirectTo = next?.startsWith("/") && !next.startsWith("//") ? next : "/admin";

  return (
    <>
      <SiteHeader />

      <main className={styles.main}>
        <div className={styles.card}>
          <p className="eyebrow">Panel de administración</p>
          <h1 className={styles.title}>Ingresa a tu cuenta</h1>
          <p className={styles.lede}>
            Desde aquí administras las marcas y los productos del catálogo.
          </p>

          <LoginForm redirectTo={redirectTo} />

          <p className={styles.hint}>
            <span className="eyebrow">Cuenta de prueba</span>
            <span className="mono">admin@example.com · admin1234</span>
          </p>
        </div>
      </main>
    </>
  );
}
