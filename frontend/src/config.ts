/**
 * Production: set VITE_API_URL in Vercel (e.g. https://api.yourdomain.com) — no trailing slash.
 * Local dev: leave unset; Vite proxies /api → localhost:8001.
 */
export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  if (raw && raw.trim()) {
    return raw.trim().replace(/\/$/, "");
  }
  return "";
}

export function apiUrl(path: string): string {
  const base = getApiBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  if (base) {
    return `${base}${p}`;
  }
  return p;
}
