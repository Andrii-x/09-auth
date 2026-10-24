import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/lib/api/logErrorResponse";

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
    return logErrorResponse(error, "Logout API request failed");
  }
}
