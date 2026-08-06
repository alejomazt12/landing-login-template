"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import styles from "./login.module.css";

type Props = {
  redirectTo: string;
};

export default function LoginForm({ redirectTo }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { message?: string };
        setError(body.message ?? "Correo o contraseña incorrectos");
        setPending(false);
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("No pudimos conectarnos con el servidor. Inténtalo de nuevo.");
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label className={styles.field}>
        <span className="eyebrow">Correo</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="admin@example.com"
          className={`mono ${styles.input}`}
        />
      </label>

      <label className={styles.field}>
        <span className="eyebrow">Contraseña</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          minLength={8}
          placeholder="••••••••"
          className={`mono ${styles.input}`}
        />
      </label>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
