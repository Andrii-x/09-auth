import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "../../api";
import { logErrorResponse } from "@/lib/api/logErrorResponse";

type NoteRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: NoteRouteContext,
) {
  const cookieStore = await cookies();
  const { id } = await params;

  try {
    const response = await api.get(`/notes/${encodeURIComponent(id)}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    return logErrorResponse(error, "Get note API request failed");
  }
}

export async function DELETE(
  _request: Request,
  { params }: NoteRouteContext,
) {
  const cookieStore = await cookies();
  const { id } = await params;

  try {
    const response = await api.delete(`/notes/${encodeURIComponent(id)}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    return logErrorResponse(error, "Delete note API request failed");
  }
}

export async function PATCH(
  request: Request,
  { params }: NoteRouteContext,
) {
  const cookieStore = await cookies();
  const { id } = await params;

  try {
    const response = await api.patch(
      `/notes/${encodeURIComponent(id)}`,
      await request.json(),
      { headers: { Cookie: cookieStore.toString() } },
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    return logErrorResponse(error, "Update note API request failed");
  }
}
