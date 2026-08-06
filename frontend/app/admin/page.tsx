import type { Metadata } from "next";
import { redirect } from "next/navigation";

import SiteHeader from "@/components/SiteHeader";
import { brands } from "@/data/catalog";
import { getCurrentUser } from "@/lib/session";

import AdminDashboard from "./AdminDashboard";
import SignOutButton from "./SignOutButton";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // The middleware only checks that a cookie exists. This is the real gate:
  // an expired or forged token fails here, before anything is rendered.
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  return (
    <>
      <SiteHeader action={<SignOutButton />} />

      <main className="container">
        <header className={styles.header}>
          <div>
            <p className="eyebrow">Panel de administración</p>
            <h1 className={styles.title}>Marcas y productos</h1>
          </div>
          <p className={`mono ${styles.user}`}>{user.email}</p>
        </header>

        <AdminDashboard initialBrands={brands} />
      </main>
    </>
  );
}
