import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseSetCookie } from "cookie";

const privateRoutes = ["/notes", "/profile"];
const authRoutes = ["/sign-in", "/sign-up"];
const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://notehub-public.goit.study"
).replace(/\/+$/, "");

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isTokenExpired(token: string): boolean {
  const payload = token.split(".")[1];
  if (!payload) return false;

  try {
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const json = atob(normalizedPayload);
    const decoded: unknown = JSON.parse(json);
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "exp" in decoded &&
      typeof decoded.exp === "number"
    ) {
      return decoded.exp * 1000 <= Date.now();
    }
    return false;
  } catch {
    return true;
  }
}

async function refreshSession(
  request: NextRequest,
  destination: URL,
): Promise<NextResponse | null> {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (!refreshToken) return null;

  const response = await fetch(`${apiBaseUrl}/api/auth/refresh`, {
    method: "POST",
    headers: { cookie: request.headers.get("cookie") ?? "" },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const headersWithSetCookie = response.headers as Headers & {
    getSetCookie?: () => string[];
  };
  const setCookieHeaders =
    headersWithSetCookie.getSetCookie?.() ??
    response.headers
      .get("set-cookie")
      ?.split(/,(?=\s*[^;,]+=)/) ??
    [];
  if (setCookieHeaders.length === 0) return null;

  const redirectResponse = NextResponse.redirect(destination);
  let cookiesSet = 0;
  for (const setCookieHeader of setCookieHeaders) {
    const { name, value, ...options } = parseSetCookie(setCookieHeader);
    if (value === undefined) continue;
    redirectResponse.cookies.set(name, value, options);
    cookiesSet++;
  }
  return cookiesSet > 0 ? redirectResponse : null;
}

export async function proxy(request: NextRequest): Promise<NextResponse | undefined> {
  const { pathname } = request.nextUrl;
  const accessToken =
    request.cookies.get("accessToken")?.value ??
    request.cookies.get("token")?.value;
  const hasValidAccessToken = Boolean(
    accessToken && !isTokenExpired(accessToken),
  );

  if (matchesRoute(pathname, privateRoutes) && !hasValidAccessToken) {
    const refreshResponse = await refreshSession(request, request.nextUrl);
    if (refreshResponse) return refreshResponse;
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (matchesRoute(pathname, authRoutes)) {
    if (hasValidAccessToken) {
      return NextResponse.redirect(new URL("/notes", request.url));
    }
    const refreshResponse = await refreshSession(
      request,
      new URL("/notes", request.url),
    );
    if (refreshResponse) {
      return refreshResponse;
    }
  }
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
