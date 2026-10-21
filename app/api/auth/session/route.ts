import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { applySetCookies } from "@/lib/api/routeCookies";

export async function GET() {
  const cookieStore = await cookies();
  try {
    const response = await api.get("/api/auth/session", {
      headers: { Cookie: cookieStore.toString() },
    });
    applySetCookies(cookieStore, response.headers["set-cookie"]);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Session API request failed:", error.response?.data ?? error.message);
      return NextResponse.json(error.response?.data ?? { error: "Unable to load session." }, {
        status: error.response?.status ?? 500,
      });
    }
    console.error("Session route failed:", error);
    return NextResponse.json({ error: "Unable to load session." }, { status: 500 });
  }
}
