export const AUTH_STORAGE_KEY = "mc_auth";

export type AuthState = { isAuthenticated: boolean; user?: string };

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_STORAGE_KEY) === "1";
}

export function signIn(username: string, password: string): boolean {
  if (typeof window === "undefined") return false;
  const ok = username === "admin" && password === "admin123";
  if (ok) localStorage.setItem(AUTH_STORAGE_KEY, "1");
  return ok;
}

export function signOut() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

