"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  redirectTo: string;
};

const INPUT_CLASS =
  "rounded-[3px] border border-line-strong bg-canvas-alt px-3 py-2.75 font-mono text-sm text-ink transition-colors duration-200 ease-board outline-none placeholder:text-ink-subtle focus:border-accent";

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
    <form className="mt-7 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <label className="flex flex-col gap-1.5">
        <span className="eyebrow">Correo</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="admin@example.com"
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="eyebrow">Contraseña</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          minLength={8}
          placeholder="••••••••"
          className={INPUT_CLASS}
        />
      </label>

      {error ? (
        <p
          role="alert"
          className="rounded-[3px] border border-danger px-3 py-2.25 text-[13px] text-danger"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 cursor-pointer rounded-[3px] bg-accent px-4 py-3 font-display text-[15px] font-bold text-canvas transition-opacity duration-200 ease-board hover:opacity-88 disabled:cursor-progress disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
