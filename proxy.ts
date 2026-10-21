import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) return null;

  const redirectResponse = NextResponse.redirect(destination);
  const cookieValues = setCookie.split(/,(?=\s*[^;,]+=)/);
  let cookiesSet = 0;
  for (const cookieValue of cookieValues) {
    const [cookiePair, ...attributes] = cookieValue.split(";");
    const separator = cookiePair.indexOf("=");
    if (separator <= 0) continue;

    const name = cookiePair.slice(0, separator).trim();
    const value = cookiePair.slice(separator + 1).trim();
    const options: {
      path?: string;
      domain?: string;
      maxAge?: number;
      expires?: Date;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "strict" | "lax" | "none";
    } = {};
    for (const attribute of attributes) {
      const [rawName, rawValue] = attribute.trim().split("=", 2);
      const attributeName = rawName.toLowerCase();
      if (attributeName === "path" && rawValue) options.path = rawValue;
      if (attributeName === "domain" && rawValue) options.domain = rawValue;
      if (attributeName === "max-age" && rawValue) {
        const maxAge = Number(rawValue);
        if (Number.isFinite(maxAge)) options.maxAge = maxAge;
      }
      if (attributeName === "expires" && rawValue) {
        const expires = new Date(rawValue);
        if (!Number.isNaN(expires.getTime())) options.expires = expires;
      }
      if (attributeName === "httponly") options.httpOnly = true;
      if (attributeName === "secure") options.secure = true;
      if (
        attributeName === "samesite" &&
        (rawValue?.toLowerCase() === "strict" ||
          rawValue?.toLowerCase() === "lax" ||
          rawValue?.toLowerCase() === "none")
      ) {
        options.sameSite = rawValue.toLowerCase() as
          | "strict"
          | "lax"
          | "none";
      }
    }
    redirectResponse.cookies.set(name, value, options);
    cookiesSet += 1;
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
