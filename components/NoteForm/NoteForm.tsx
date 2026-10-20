"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createNote } from "@/lib/api/clientApi";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteDraft, NoteTag } from "@/types/note";

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting"];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);
  const [error, setError] = useState<string | null>(null);
  const createMutation = useMutation({
    mutationFn: (note: NoteDraft) => createNote(note),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.push("/notes");
    },
    onError: (cause: Error) => setError(cause.message),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError(null);
    createMutation.mutate(draft);
  }

  return (
    <main className="formPage">
      <form className="noteForm" onSubmit={handleSubmit}>
        <h1>Create note</h1>
        <label>
          Title
          <input
            required
            value={draft.title}
            onChange={(event) => setDraft({ title: event.currentTarget.value })}
          />
        </label>
        <label>
          Content
          <textarea
            required
            rows={6}
            value={draft.content}
            onChange={(event) =>
              setDraft({ content: event.currentTarget.value })
            }
          />
        </label>
        <label>
          Tag
          <select
            value={draft.tag}
            onChange={(event) => {
              const tag = tags.find(
                (option) => option === event.currentTarget.value,
              );
              if (tag) setDraft({ tag });
            }}
          >
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
        {error ? <p role="alert">{error}</p> : null}
        <div className="formActions">
          <button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Saving..." : "Save note"}
          </button>
          <button
            type="button"
            onClick={() => {
              clearDraft();
              router.back();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
