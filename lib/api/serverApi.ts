import "server-only";
import { cookies } from "next/headers";
import { isAxiosError, type AxiosResponse } from "axios";
import { api } from "@/lib/api/api";
import type {
  Note,
  NoteDraft,
  NotesQuery,
  NotesResponse,
} from "@/types/note";
import type { UpdateUserData, User } from "@/types/user";

export type SessionResponse = {
  user: User | null;
};

async function cookieConfig(): Promise<{
  headers: { Cookie: string };
}> {
  const cookieStore = await cookies();
  return { headers: { Cookie: cookieStore.toString() } };
}

async function requestWithCookie<T>(
  request: () => Promise<AxiosResponse<T>>,
): Promise<AxiosResponse<T>> {
  try {
    return await request();
  } catch (error: unknown) {
    if (isAxiosError(error) && !error.response) {
      throw new Error(`API request failed: ${error.message}`, { cause: error });
    }
    throw error;
  }
}

export async function fetchNotesServer(
  query: NotesQuery = {},
): Promise<AxiosResponse<NotesResponse>> {
  const config = await cookieConfig();
  return requestWithCookie(() => api.get("/notes", { ...config, params: query }));
}

export async function fetchNoteByIdServer(
  id: string,
): Promise<AxiosResponse<Note>> {
  const config = await cookieConfig();
  return requestWithCookie(() =>
    api.get(`/notes/${encodeURIComponent(id)}`, config),
  );
}

export async function createNoteServer(
  note: NoteDraft,
): Promise<AxiosResponse<Note>> {
  const config = await cookieConfig();
  return requestWithCookie(() => api.post("/notes", note, config));
}

export async function deleteNoteServer(
  id: string,
): Promise<AxiosResponse<Note>> {
  const config = await cookieConfig();
  return requestWithCookie(() =>
    api.delete(`/notes/${encodeURIComponent(id)}`, config),
  );
}

export async function getCurrentUserServer(): Promise<AxiosResponse<User>> {
  const config = await cookieConfig();
  return requestWithCookie(() => api.get("/users/me", config));
}

export async function updateCurrentUserServer(
  data: UpdateUserData,
): Promise<AxiosResponse<User>> {
  const config = await cookieConfig();
  return requestWithCookie(() => api.patch("/users/me", data, config));
}

export async function getSessionServer(): Promise<
  AxiosResponse<SessionResponse>
> {
  const config = await cookieConfig();
  return requestWithCookie(() => api.get("/auth/session", config));
}
