/// <reference types="node" />

/**
 * Vercel Edge: proxies /api/* → BACKEND_PROXY_URL so the browser only talks to your .vercel.app origin.
 * Set BACKEND_PROXY_URL in Vercel (Production) to your real API, e.g. https://xxx.onrender.com
 * Remove VITE_API_URL so the SPA uses relative /api paths.
 */
export const config = {
  matcher: "/api/:path*",
};

export default async function middleware(request: Request): Promise<Response> {
  const backendBase = process.env.BACKEND_PROXY_URL?.replace(/\/$/, "").trim();
  if (!backendBase) {
    return new Response(
      JSON.stringify({
        detail:
          "Vercel BACKEND_PROXY_URL is not set. In Project → Environment Variables add BACKEND_PROXY_URL=https://your-api-host (no trailing slash), remove VITE_API_URL, redeploy.",
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  const incoming = new URL(request.url);
  const targetUrl = `${backendBase}${incoming.pathname}${incoming.search}`;

  const hdrs = new Headers();
  request.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === "host" || k === "connection" || k === "keep-alive") return;
    hdrs.set(key, value);
  });

  const init: RequestInit = {
    method: request.method,
    headers: hdrs,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  const upstream = await fetch(targetUrl, init);

  const outHeaders = new Headers(upstream.headers);
  if (upstream.headers.get("content-type")?.includes("text/event-stream")) {
    outHeaders.set("Cache-Control", "no-cache, no-transform");
    outHeaders.set("X-Accel-Buffering", "no");
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  });
}
