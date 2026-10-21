import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { api } from "@/app/api/api";
import { applySetCookies } from "@/lib/api/routeCookies";

type NoteRouteContext = {
  params: Promise<{ id: string }>;
};

async function forwardNoteRequest(
  request: NextRequest,
  id: string,
  method: "get" | "delete" | "patch",
) {
  const cookieStore = await cookies();
  const url = `/api/notes/${encodeURIComponent(id)}`;
  const config = {
    headers: { Cookie: cookieStore.toString() },
    params: request.nextUrl.searchParams,
  };

  try {
    const response =
      method === "get"
        ? await api.get(url, config)
        : method === "delete"
          ? await api.delete(url, config)
          : await api.patch(url, await request.json(), config);
    applySetCookies(cookieStore, response.headers["set-cookie"]);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(`Note ${method.toUpperCase()} API request failed:`, error.response?.data ?? error.message);
      return NextResponse.json(error.response?.data ?? { error: "Note request failed." }, {
        status: error.response?.status ?? 500,
      });
    }
    console.error(`Note ${method.toUpperCase()} route failed:`, error);
    return NextResponse.json({ error: "Note request failed." }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: NoteRouteContext) {
  const { id } = await params;
  return forwardNoteRequest(request, id, "get");
}

export async function DELETE(request: NextRequest, { params }: NoteRouteContext) {
  const { id } = await params;
  return forwardNoteRequest(request, id, "delete");
}

export async function PATCH(request: NextRequest, { params }: NoteRouteContext) {
  const { id } = await params;
  return forwardNoteRequest(request, id, "patch");
}
