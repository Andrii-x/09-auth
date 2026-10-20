import Link from "next/link";

const tags = ["Todo", "Work", "Personal", "Meeting"];

export default function NotesFilterSidebar() {
  return (
    <aside aria-label="Note filters">
      <h2>Tags</h2>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>
            <Link href={`/notes/filter/${tag}`}>{tag}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}