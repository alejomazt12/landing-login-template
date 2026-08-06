"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import styles from "./admin.module.css";

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
      className={`mono ${styles.signOut}`}
    >
      {pending ? "Saliendo…" : "Salir"}
    </button>
  );
}
