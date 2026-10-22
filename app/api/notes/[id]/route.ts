import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/lib/api/logErrorResponse";

type NoteRouteContext = {
  params: Promise<{ id: string }>;
};

async function forwardNoteRequest(
  request: NextRequest,
  id: string,
  method: "get" | "delete" | "patch",
) {
  const cookieStore = await cookies();
  const url = `/notes/${encodeURIComponent(id)}`;
  const config = {
    headers: { Cookie: cookieStore.toString() },
  };

  try {
    const response =
      method === "get"
        ? await api.get(url, config)
        : method === "delete"
          ? await api.delete(url, config)
          : await api.patch(url, await request.json(), {
              ...config,
              headers: {
                ...config.headers,
                "Content-Type": "application/json",
              },
            });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    return logErrorResponse(
      error,
      `Note ${method.toUpperCase()} API request failed`,
      "Note request failed.",
    );
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
