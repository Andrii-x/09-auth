import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/lib/api/logErrorResponse";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  try {
    const response = await api.get("/users/me", {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    return logErrorResponse(error, "Current user API request failed");
  }
}

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  try {
    const response = await api.patch("/users/me", await request.json(), {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    return logErrorResponse(error, "Update user API request failed");
  }
}
