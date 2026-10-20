export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting";

export type Note = {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt?: string;
  updatedAt?: string;
};

export type NoteDraft = Pick<Note, "title" | "content" | "tag">;

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

export type NotesQuery = {
  search?: string;
  page?: number;
  tag?: NoteTag;
};
