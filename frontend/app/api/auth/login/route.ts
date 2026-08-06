import { NextResponse } from "next/server";

import { apiBaseUrl, SESSION_COOKIE } from "@/lib/session";

/**
 * Proxy the credentials to FastAPI and store the token in an httpOnly cookie.
 *
 * Going through the server keeps the token out of reach of client JavaScript
 * and avoids exposing the API origin to the browser.
 */
export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Solicitud inválida" }, { status: 400 });
  }

  const { email, password } = (payload ?? {}) as {
    email?: unknown;
    password?: unknown;
  };

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { message: "Escribe tu correo y tu contraseña" },
      { status: 400 },
    );
  }

  let apiResponse: Response;

  try {
    apiResponse = await fetch(`${apiBaseUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "No pudimos conectarnos con el servidor. Inténtalo de nuevo." },
      { status: 503 },
    );
  }

  if (!apiResponse.ok) {
    return NextResponse.json(
      { message: "Correo o contraseña incorrectos" },
      { status: 401 },
    );
  }

  const { access_token: accessToken, expires_in: expiresIn } =
    (await apiResponse.json()) as { access_token: string; expires_in: number };

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: SESSION_COOKIE,
    value: accessToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: expiresIn,
  });

  return response;
}
