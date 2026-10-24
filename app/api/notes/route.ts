import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/lib/api/logErrorResponse";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") || "1");
  const tag = searchParams.get("tag") ?? "All";
  const search = searchParams.get("search") ?? "";

  try {
    const response = await api.get("/notes", {
      headers: { Cookie: cookieStore.toString() },
      params: {
        page: Number.isFinite(page) && page > 0 ? page : 1,
        tag: tag === "All" ? "" : tag,
        search,
      },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    return logErrorResponse(error, "Notes API request failed");
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  try {
    const response = await api.post("/notes", await request.json(), {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    return logErrorResponse(error, "Create note API request failed");
  }
}
