export default async function NotesFilterSlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return <div>{slug?.join('/') ?? 'slug'}</div>;
}