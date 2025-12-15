import type { Metadata } from 'next';
import fetchNotes from '@/lib/api';
// import { fetchNoteById } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';

type NotePageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  // read route params
  const { slug } = await params;
  const noteRaw = slug[0];
  const isAll = noteRaw.toLowerCase() === 'all';
  const title = `Notes:${noteRaw}`;
  const filterTitle = isAll ? 'All notes' : `Notes filtered by ${noteRaw}`;
  // const note = await fetchNoteById(noteId);
  return {
    title: title,
    description: isAll
      ? 'Browse all available notes'
      : `Browse notes filtered by category ${noteRaw}`,
    openGraph: {
      title: title,
      description: filterTitle,
      url: `https://ac.goit.global/fullstack/react/notehub-og-meta.jpg`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub',
        },
      ],
      type: 'article',
    },
  };
}

export default async function NotesByCategory({ params }: NotePageProps) {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, tag],
    queryFn: () => fetchNotes('', 1, tag),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
