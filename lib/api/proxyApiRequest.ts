import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import api from "@/lib/api/api";

export async function proxyApiRequest(
  request: NextRequest,
  endpoint: string,
): Promise<NextResponse> {
  const cookie = request.headers.get("cookie");
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");
  const headers: Record<string, string> = {};
  if (cookie) headers.Cookie = cookie;
  if (contentType) headers["Content-Type"] = contentType;
  if (accept) headers.Accept = accept;

  try {
    const response = await api.request({
      url: endpoint,
      method: request.method,
      params: Object.fromEntries(request.nextUrl.searchParams.entries()),
      data:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      headers,
      responseType: "arraybuffer",
      validateStatus: () => true,
    });
    const responseHeaders = new Headers();
    const responseType = response.headers["content-type"];
    const setCookie = response.headers["set-cookie"];
    if (typeof responseType === "string") {
      responseHeaders.set("content-type", responseType);
    }
    if (Array.isArray(setCookie)) {
      for (const cookieValue of setCookie) {
        if (typeof cookieValue === "string") {
          responseHeaders.append("set-cookie", cookieValue);
        }
      }
    } else if (typeof setCookie === "string") {
      responseHeaders.append("set-cookie", setCookie);
    }

    return new NextResponse(response.data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: unknown) {
    if (!isAxiosError(error)) throw error;

    return NextResponse.json(
      error.response?.data ?? { error: error.message },
      { status: error.response?.status ?? 502 },
    );
  }
}
