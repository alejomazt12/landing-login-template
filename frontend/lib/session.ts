import "server-only";

import { cookies } from "next/headers";

export const SESSION_COOKIE = "session";

export type SessionUser = {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
};

/** Base URL of the FastAPI service. Server-side only — never sent to the browser. */
export function apiBaseUrl(): string {
  return process.env.API_URL ?? "http://localhost:3031";
}

/**
 * Resolve the signed-in user from the session cookie.
 *
 * Returns null for anonymous visitors and for tokens the API rejects, so
 * callers only need one "not signed in" branch.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as SessionUser;
  } catch {
    // The API being unreachable must not crash the page; treat it as signed out.
    return null;
  }
}
