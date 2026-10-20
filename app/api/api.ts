import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api/api";

export { api };

export async function proxyApiRequest(
  request: NextRequest,
  endpoint: string,
): Promise<NextResponse> {
  const query = request.nextUrl.search;
  const url = `${api.defaults.baseURL}/${endpoint}${query}`;
  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");
  if (cookie) headers.set("cookie", cookie);
  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);

  const method = request.method.toUpperCase();
  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : await request.arrayBuffer();
  const upstream = await fetch(url, {
    method,
    headers,
    body,
    cache: "no-store",
  });
  const responseHeaders = new Headers();
  const upstreamContentType = upstream.headers.get("content-type");
  const setCookie = upstream.headers.get("set-cookie");
  if (upstreamContentType) responseHeaders.set("content-type", upstreamContentType);
  if (setCookie) responseHeaders.append("set-cookie", setCookie);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
