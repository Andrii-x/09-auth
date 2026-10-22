import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/lib/api/logErrorResponse";
import type { NoteTag, NotesQuery } from "@/types/note";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const searchParams = request.nextUrl.searchParams;
  const pageValue = searchParams.get("page");
  const page = pageValue ? Number(pageValue) : undefined;
  const rawTag = searchParams.get("tag");
  const validTags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting"];
  const tag = validTags.find(
    (validTag) => validTag.toLowerCase() === rawTag?.toLowerCase(),
  );
  const params: NotesQuery = {
    search: searchParams.get("search") ?? undefined,
    page: page !== undefined && Number.isFinite(page) ? page : undefined,
    tag,
  };

  try {
    const response = await api.get("/notes", {
      headers: { Cookie: cookieStore.toString() },
      params,
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    return logErrorResponse(
      error,
      "Notes API request failed",
      "Unable to load notes.",
    );
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
    return logErrorResponse(
      error,
      "Create note API request failed",
      "Unable to create note.",
    );
  }
}
