import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/lib/api/logErrorResponse";

export async function GET() {
  const cookieStore = await cookies();
  try {
    const response = await api.get("/users", {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    return logErrorResponse(
      error,
      "Users API request failed",
      "Unable to load users.",
    );
  }
}
