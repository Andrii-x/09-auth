"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/clientApi";

type NotePreviewProps = {
  id: string;
};

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();
  const noteQuery = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <Modal onClose={() => router.back()}>
      <button type="button" onClick={() => router.back()} aria-label="Close note">
        Close
      </button>
      {noteQuery.isPending ? <p role="status">Loading note...</p> : null}
      {noteQuery.isError ? (
        <p role="alert">
          {noteQuery.error instanceof Error
            ? noteQuery.error.message
            : "Could not load this note."}
        </p>
      ) : null}
      {noteQuery.data ? (
        <article>
          <h1>{noteQuery.data.title}</h1>
          <p>{noteQuery.data.content}</p>
          <p>
            <strong>Tag:</strong> {noteQuery.data.tag}
          </p>
        </article>
      ) : null}
    </Modal>
  );
}
