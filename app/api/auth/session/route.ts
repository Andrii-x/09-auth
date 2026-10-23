import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "@/app/api/api";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const response = await api.get("/api/auth/session", {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Session API request failed:", error.response?.data ?? error.message);
      return NextResponse.json(
        error.response?.data ?? { user: null },
        { status: error.response?.status ?? 500 },
      );
    }
    console.error("Session route failed:", error);
    return NextResponse.json({ error: "Unable to load session." }, { status: 500 });
  }
}
