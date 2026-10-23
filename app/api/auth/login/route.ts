import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { api } from "@/app/api/api";
import { applySetCookies } from "@/lib/api/routeCookies";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  try {
    const response = await api.post("/api/auth/login", await request.json(), {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
    });
    applySetCookies(cookieStore, response.headers["set-cookie"]);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Login API request failed:", error.response?.data ?? error.message);
      return NextResponse.json(
        error.response?.data ?? { error: "Login failed." },
        { status: error.response?.status ?? 500 },
      );
    }
    console.error("Login route failed:", error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
