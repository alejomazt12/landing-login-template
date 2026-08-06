"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className="cursor-pointer rounded-[3px] border border-line bg-surface px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-ink-muted transition-colors duration-200 ease-board hover:border-line-strong hover:text-ink disabled:opacity-60"
    >
      {pending ? "Saliendo…" : "Salir"}
    </button>
  );
}
