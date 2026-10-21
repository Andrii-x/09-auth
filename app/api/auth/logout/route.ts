import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { applySetCookies } from "@/lib/api/routeCookies";

export async function POST() {
  const cookieStore = await cookies();
  try {
    const response = await api.post("/api/auth/logout", null, {
      headers: { Cookie: cookieStore.toString() },
    });
    applySetCookies(cookieStore, response.headers["set-cookie"]);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Logout API request failed:", error.response?.data ?? error.message);
      return NextResponse.json(error.response?.data ?? { error: "Logout failed." }, {
        status: error.response?.status ?? 500,
      });
    }
    console.error("Logout route failed:", error);
    return NextResponse.json({ error: "Logout failed." }, { status: 500 });
  }
}
