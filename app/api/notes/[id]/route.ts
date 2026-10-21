import { proxyApiRequest } from "@/lib/api/proxyApiRequest";
import type { NextRequest } from "next/server";

type NoteRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: NoteRouteContext,
) {
  const { id } = await params;
  return proxyApiRequest(request, `notes/${encodeURIComponent(id)}`);
}

export async function DELETE(
  request: NextRequest,
  { params }: NoteRouteContext,
) {
  const { id } = await params;
  return proxyApiRequest(request, `notes/${encodeURIComponent(id)}`);
}

export async function PATCH(
  request: NextRequest,
  { params }: NoteRouteContext,
) {
  const { id } = await params;
  return proxyApiRequest(request, `notes/${encodeURIComponent(id)}`);
}