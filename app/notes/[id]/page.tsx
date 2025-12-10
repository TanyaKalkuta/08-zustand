import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};
export default async function NoteDetails({ params }: Props) {
  const { id } = await params;
  console.log('note id:', id);
  if (id === 'mama') {
    notFound();
  }
  const queryClient = new QueryClient();
  // 2. Префетч для кешу (не заміняє отримання note!)
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
