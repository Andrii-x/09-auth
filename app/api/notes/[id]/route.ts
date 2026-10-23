import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "@/app/api/api";

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
    const response = await api.get(`/api/notes/${encodeURIComponent(id)}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Get note API request failed:", error.response?.data ?? error.message);
      return NextResponse.json(
        error.response?.data ?? { error: "Unable to load note." },
        { status: error.response?.status ?? 500 },
      );
    }
    console.error("Get note route failed:", error);
    return NextResponse.json({ error: "Unable to load note." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: NoteRouteContext,
) {
  const cookieStore = await cookies();
  const { id } = await params;

  try {
    const response = await api.delete(`/api/notes/${encodeURIComponent(id)}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Delete note API request failed:", error.response?.data ?? error.message);
      return NextResponse.json(
        error.response?.data ?? { error: "Unable to delete note." },
        { status: error.response?.status ?? 500 },
      );
    }
    console.error("Delete note route failed:", error);
    return NextResponse.json({ error: "Unable to delete note." }, { status: 500 });
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
      `/api/notes/${encodeURIComponent(id)}`,
      await request.json(),
      {
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
      },
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Update note API request failed:", error.response?.data ?? error.message);
      return NextResponse.json(
        error.response?.data ?? { error: "Unable to update note." },
        { status: error.response?.status ?? 500 },
      );
    }
    console.error("Update note route failed:", error);
    return NextResponse.json({ error: "Unable to update note." }, { status: 500 });
  }
}
