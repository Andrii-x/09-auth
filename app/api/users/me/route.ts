import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { api } from "@/app/api/api";
import { isAxiosError } from "axios";

export async function GET() {
  const cookieStore = await cookies();
  try {
    const response = await api.get("/api/users/me", {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Current user API request failed:", error.response?.data ?? error.message);
      return NextResponse.json(
        error.response?.data ?? { error: "Unable to load user." },
        { status: error.response?.status ?? 500 },
      );
    }
    console.error("Current user route failed:", error);
    return NextResponse.json({ error: "Unable to load user." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  try {
    const response = await api.patch("/api/users/me", await request.json(), {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Update user API request failed:", error.response?.data ?? error.message);
      return NextResponse.json(
        error.response?.data ?? { error: "Unable to update user." },
        { status: error.response?.status ?? 500 },
      );
    }
    console.error("Update user route failed:", error);
    return NextResponse.json({ error: "Unable to update user." }, { status: 500 });
  }
}
