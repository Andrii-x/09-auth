import "server-only";
import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import api from "@/lib/api/api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

type ApiEnvelope<T> = T | { data: T };

function unwrap<T>(response: AxiosResponse<ApiEnvelope<T>>): T {
  const body = response.data;
  return typeof body === "object" && body !== null && "data" in body
    ? body.data
    : body;
}

function unwrapField<T>(response: AxiosResponse<unknown>, key: string): T {
  let body = response.data;
  if (typeof body === "object" && body !== null && "data" in body) {
    body = Reflect.get(body, "data");
  }
  if (typeof body === "object" && body !== null && key in body) {
    return Reflect.get(body, key) as T;
  }
  return body as T;
}

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const response = await api.get<ApiEnvelope<Note | { note: Note }>>(
    `/notes/${encodeURIComponent(id)}`,
    { headers: { Cookie: await getCookieHeader() } },
  );
  return unwrapField<Note>(response, "note");
}

export async function getCurrentUserServer(): Promise<User> {
  const response = await api.get<ApiEnvelope<User | { user: User }>>("/users/me", {
    headers: { Cookie: await getCookieHeader() },
  });
  return unwrapField<User>(response, "user");
}

export async function getSessionServer(): Promise<{ user: User | null }> {
  const response = await api.get<ApiEnvelope<{ user: User | null }>>(
    "/auth/session",
    { headers: { Cookie: await getCookieHeader() } },
  );
  return unwrap(response);
}
