import Link from "next/link";

const tags = ["Todo", "Work", "Personal", "Meeting"];

export default function NotesFilterPage() {
  return (
    <main className="notesPage">
      <h1>Filter notes by tag</h1>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>
            <Link href={`/notes/filter/${tag}`}>{tag}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}