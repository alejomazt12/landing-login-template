import type { Metadata } from "next";
import { redirect } from "next/navigation";

import SiteHeader from "@/components/SiteHeader";
import { brands } from "@/data/catalog";
import { getCurrentUser } from "@/lib/session";

import AdminDashboard from "./AdminDashboard";
import SignOutButton from "./SignOutButton";

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

      <main className="page-container">
        <header className="flex flex-wrap items-end justify-between gap-5 border-b border-line pt-11 pb-6.5">
          <div>
            <p className="eyebrow">Panel de administración</p>
            <h1 className="mt-2 text-[clamp(2rem,5vw,3rem)] tracking-[-0.03em]">
              Marcas y productos
            </h1>
          </div>
          <p className="font-mono text-xs text-ink-subtle">{user.email}</p>
        </header>

        <AdminDashboard initialBrands={brands} />
      </main>
    </>
  );
}
