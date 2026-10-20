"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import type { NoteTag } from "@/types/note";

type NotesDashboardProps = {
  tag?: NoteTag;
};

export default function NotesDashboard({ tag }: NotesDashboardProps) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const notesQuery = useQuery({
    queryKey: ["notes", { page, search, tag }],
    queryFn: () => fetchNotes({ page, search, tag }),
  });

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
        <SearchBox value={searchInput} onChange={setSearchInput} />
        <Link href="/notes/action/create">Create note</Link>
      </header>
      <NoteList notes={notesQuery.data.notes} />
      <Pagination
        page={page}
        totalPages={notesQuery.data.totalPages}
        onPageChange={setPage}
      />
    </main>
  );
}
