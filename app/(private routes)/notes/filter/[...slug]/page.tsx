import FilteredNotes from "./Notes.client";

type NotesFilterPageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesFilterPage({
  params,
}: NotesFilterPageProps) {
  const { slug } = await params;
  return <FilteredNotes tag={slug[0] ?? ""} />;
}
