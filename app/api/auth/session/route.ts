import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/lib/api/logErrorResponse";
import { applySetCookies } from "@/lib/api/routeCookies";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken =
    cookieStore.get("accessToken")?.value ?? cookieStore.get("token")?.value;
  if (!accessToken) {
    return NextResponse.json({ user: null });
  }

  try {
    const response = await api.get("/auth/session", {
      headers: { Cookie: cookieStore.toString() },
    });
    applySetCookies(cookieStore, response.headers["set-cookie"]);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    return logErrorResponse(
      error,
      "Session API request failed",
      "Unable to load session.",
    );
  }
}
