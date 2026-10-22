"use client";

import Link from "next/link";
import { useEffect, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import type { NoteTag } from "@/types/note";

const noteTags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting"];

type NotesState = {
  page: number;
  searchInput: string;
  search: string;
};

type NotesAction =
  | { type: "search-input-changed"; value: string }
  | { type: "search-debounced"; value: string }
  | { type: "page-changed"; page: number };

type NotesProps = {
  tag?: string;
};

const initialState: NotesState = {
  page: 1,
  searchInput: "",
  search: "",
};

function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case "search-input-changed":
      return { ...state, searchInput: action.value };
    case "search-debounced":
      return { ...state, search: action.value, page: 1 };
    case "page-changed":
      return { ...state, page: action.page };
  }
}

export default function Notes({ tag }: NotesProps) {
  const selectedTag = tag
    ? noteTags.find((noteTag) => noteTag.toLowerCase() === tag.toLowerCase())
    : undefined;
  const [state, dispatch] = useReducer(notesReducer, initialState);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      dispatch({
        type: "search-debounced",
        value: state.searchInput.trim(),
      });
    }, 350);
    return () => window.clearTimeout(timeoutId);
  }, [state.searchInput]);

  const notesQuery = useQuery({
    queryKey: ["notes", { page: state.page, search: state.search, tag: selectedTag }],
    enabled: !tag || Boolean(selectedTag),
    queryFn: () =>
      fetchNotes({ page: state.page, search: state.search, tag: selectedTag }),
  });

  if (tag && !selectedTag) {
    return <p role="alert">Unknown note tag: {tag}</p>;
  }
  if (notesQuery.isPending) return <p role="status">Loading notes...</p>;
  if (notesQuery.isError) {
    return (
      <p role="alert">
        {notesQuery.error instanceof Error
          ? notesQuery.error.message
          : "Could not load notes."}
      </p>
    );
  }

  return (
    <main className="notesPage">
      <header className="notesToolbar">
        <h1>Notes</h1>
        <SearchBox
          value={state.searchInput}
          onChange={(value) =>
            dispatch({ type: "search-input-changed", value })
          }
        />
        <Link href="/notes/action/create">Create note</Link>
      </header>
      {notesQuery.data.notes.length > 0 ? (
        <>
          <NoteList notes={notesQuery.data.notes} />
          <Pagination
            page={state.page}
            totalPages={notesQuery.data.totalPages}
            onPageChange={(page) => dispatch({ type: "page-changed", page })}
          />
        </>
      ) : null}
    </main>
  );
}
