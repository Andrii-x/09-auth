"use client";

import Notes from "../../Notes.client";
import type { NoteTag } from "@/types/note";

const noteTags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting"];

type FilteredNotesProps = {
  tag: string;
};

export default function FilteredNotes({ tag }: FilteredNotesProps) {
  const selectedTag = noteTags.find(
    (noteTag) => noteTag.toLowerCase() === tag.toLowerCase(),
  );

  if (!selectedTag) return <p role="alert">Unknown note tag: {tag}</p>;
  return <Notes tag={selectedTag} />;
}
