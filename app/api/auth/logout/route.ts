import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/lib/api/logErrorResponse";
import { applySetCookies } from "@/lib/api/routeCookies";

export async function POST() {
  const cookieStore = await cookies();
  try {
    const response = await api.post("/auth/logout", null, {
      headers: { Cookie: cookieStore.toString() },
    });
    applySetCookies(cookieStore, response.headers["set-cookie"]);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    return logErrorResponse(error, "Logout API request failed", "Logout failed.");
  }
}
