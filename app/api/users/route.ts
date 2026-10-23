import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { isAxiosError } from "axios";

export async function GET() {
  const cookieStore = await cookies();
  try {
    const response = await api.get("/api/users", {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Users API request failed:", error.response?.data ?? error.message);
      return NextResponse.json(
        error.response?.data ?? { error: "Unable to load users." },
        { status: error.response?.status ?? 500 },
      );
    }
    console.error("Users route failed:", error);
    return NextResponse.json({ error: "Unable to load users." }, { status: 500 });
  }
}
