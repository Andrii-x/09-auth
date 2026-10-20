import type { AxiosResponse } from "axios";
import api from "@/lib/api/api";
import type { Note, NoteDraft, NotesQuery, NotesResponse } from "@/types/note";
import type {
  Credentials,
  RegistrationData,
  UpdateUserData,
  User,
} from "@/types/user";

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

export async function fetchNotes(query: NotesQuery = {}): Promise<NotesResponse> {
  const response = await api.get<ApiEnvelope<NotesResponse>>("/notes", {
    params: query,
  });
  return unwrap(response);
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<ApiEnvelope<Note | { note: Note }>>(
    `/notes/${encodeURIComponent(id)}`,
  );
  return unwrapField<Note>(response, "note");
}

export async function createNote(note: NoteDraft): Promise<Note> {
  const response = await api.post<ApiEnvelope<Note | { note: Note }>>(
    "/notes",
    note,
  );
  return unwrapField<Note>(response, "note");
}

export async function deleteNote(id: string): Promise<void> {
  await api.delete(`/notes/${encodeURIComponent(id)}`);
}

export async function login(credentials: Credentials): Promise<User> {
  const response = await api.post<ApiEnvelope<User | { user: User }>>(
    "/auth/login",
    credentials,
  );
  return unwrapField<User>(response, "user");
}

export async function register(data: RegistrationData): Promise<User> {
  const response = await api.post<ApiEnvelope<User | { user: User }>>(
    "/auth/register",
    data,
  );
  return unwrapField<User>(response, "user");
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getSession(): Promise<{ user: User | null }> {
  const response = await api.get<ApiEnvelope<{ user: User | null }>>("/auth/session");
  return unwrap(response);
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<ApiEnvelope<User | { user: User }>>("/users/me");
  return unwrapField<User>(response, "user");
}

export async function updateCurrentUser(data: UpdateUserData): Promise<User> {
  const response = await api.patch<ApiEnvelope<User | { user: User }>>(
    "/users/me",
    data,
  );
  return unwrapField<User>(response, "user");
}
