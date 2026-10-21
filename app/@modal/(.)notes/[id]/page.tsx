import { isAxiosError } from "axios";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotePreview from "./NotePreview.client";
import { fetchNoteByIdServer } from "@/lib/api/serverApi";

type NotePreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotePreviewPage({
  params,
}: NotePreviewPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const queryKey = ["note", id];

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => (await fetchNoteByIdServer(id)).data,
  });
  const noteError = queryClient.getQueryState(queryKey)?.error;
  if (isAxiosError(noteError) && noteError.response?.status === 404) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}
