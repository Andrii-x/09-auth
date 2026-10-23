import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { api } from "@/app/api/api";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? "1");
  const tag = searchParams.get("tag") ?? "All";
  const search = searchParams.get("search") ?? "";

  try {
    const response = await api.get("/api/notes", {
      headers: { Cookie: cookieStore.toString() },
      params: {
        page: Number.isFinite(page) && page > 0 ? page : 1,
        ...(tag !== "All" ? { tag } : {}),
        ...(search ? { search } : {}),
      },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Notes API request failed:", error.response?.data ?? error.message);
      return NextResponse.json(
        error.response?.data ?? { error: "Unable to load notes." },
        { status: error.response?.status ?? 500 },
      );
    }
    console.error("Notes route failed:", error);
    return NextResponse.json({ error: "Unable to load notes." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  try {
    const response = await api.post("/api/notes", await request.json(), {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Create note API request failed:", error.response?.data ?? error.message);
      return NextResponse.json(
        error.response?.data ?? { error: "Unable to create note." },
        { status: error.response?.status ?? 500 },
      );
    }
    console.error("Create note route failed:", error);
    return NextResponse.json({ error: "Unable to create note." }, { status: 500 });
  }
}
