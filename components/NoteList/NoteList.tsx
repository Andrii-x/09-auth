"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

type NoteListProps = {
  notes: Note[];
};

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (notes.length === 0) {
    return (
      <>
        <p>No notes found.</p>
        {deleteMutation.error ? (
          <p role="alert">
            {deleteMutation.error instanceof Error
              ? deleteMutation.error.message
              : "Could not delete the note."}
          </p>
        ) : null}
      </>
    );
  }

  return (
    <ul className="noteList">
      {notes.map((note) => (
        <li className="noteCard" key={note.id}>
          <h2>
            <Link href={`/notes/${encodeURIComponent(note.id)}`}>
              {note.title}
            </Link>
          </h2>
          <p>{note.content}</p>
          <p>
            <strong>Tag:</strong> {note.tag}
          </p>
          <button
            type="button"
            onClick={() => deleteMutation.mutate(note.id)}
            disabled={deleteMutation.isPending}
            aria-label={`Delete ${note.title}`}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </li>
      ))}
      {deleteMutation.error ? (
        <li role="alert">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : "Could not delete the note."}
        </li>
      ) : null}
    </ul>
  );
}
