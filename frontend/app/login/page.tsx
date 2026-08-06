import type { Metadata } from "next";
import { redirect } from "next/navigation";

import SiteHeader from "@/components/SiteHeader";
import { getCurrentUser } from "@/lib/session";

import LoginForm from "./LoginForm";

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

      <main className="flex items-start justify-center px-7 pt-18 pb-24">
        <div className="w-full max-w-[420px] rounded-[3px] border border-line border-t-[3px] border-t-accent bg-surface px-8 pt-8.5 pb-7.5">
          <p className="eyebrow">Panel de administración</p>
          <h1 className="mt-2.5 text-[34px] tracking-[-0.03em]">Ingresa a tu cuenta</h1>
          <p className="mt-2.5 text-[14.5px] text-ink-muted">
            Desde aquí administras las marcas y los productos del catálogo.
          </p>

          <LoginForm redirectTo={redirectTo} />

          <p className="mt-6 flex flex-col gap-0.75 border-t border-line pt-4.5 text-xs text-ink-subtle">
            <span className="eyebrow">Cuenta de prueba</span>
            <span className="font-mono">admin@example.com · admin1234</span>
          </p>
        </div>
      </main>
    </>
  );
}
