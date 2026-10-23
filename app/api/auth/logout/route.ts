import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "@/app/api/api";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { error: "Authentication tokens are missing." },
      { status: 401 },
    );
  }

  try {
    const response = await api.post(
      "/api/auth/logout",
      {},
      {
        headers: {
          Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    const logoutResponse = NextResponse.json(response.data, {
      status: response.status,
    });
    logoutResponse.cookies.delete("accessToken");
    logoutResponse.cookies.delete("refreshToken");
    return logoutResponse;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Logout API request failed:", error.response?.data ?? error.message);
      return NextResponse.json(
        error.response?.data ?? { error: "Logout failed." },
        { status: error.response?.status ?? 500 },
      );
    }
    console.error("Logout route failed:", error);
    return NextResponse.json({ error: "Logout failed." }, { status: 500 });
  }
}
