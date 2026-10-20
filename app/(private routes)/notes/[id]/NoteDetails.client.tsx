"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";

type NoteDetailsProps = {
  id: string;
};

export default function NoteDetails({ id }: NoteDetailsProps) {
  const noteQuery = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (noteQuery.isPending) return <p role="status">Loading note...</p>;
  if (noteQuery.isError) {
    return (
      <p role="alert">
        {noteQuery.error instanceof Error
          ? noteQuery.error.message
          : "Could not load this note."}
      </p>
    );
  }

  return (
    <main className="noteDetails">
      <h1>{noteQuery.data.title}</h1>
      <p>{noteQuery.data.content}</p>
      <p>
        <strong>Tag:</strong> {noteQuery.data.tag}
      </p>
    </main>
  );
}
