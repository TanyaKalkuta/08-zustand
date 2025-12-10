import { fetchNoteById } from '@/lib/api';
import NotePreviewClient from './NotePreview.client';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';

type Props = {
  params: Promise<{ id: string }>;
};
export default async function NotePreview({ params }: Props) {
  const { id } = await params;
  console.log('note id:', id);

  const queryClient = new QueryClient();
  // 2. Префетч для кешу (не заміняє отримання note!)
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient />
    </HydrationBoundary>
  );
}
