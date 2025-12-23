import { Metadata } from 'next';
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);
  return {
    title: `Note: ${note.title}`,
    description: note.content.slice(0, 30),
    openGraph: {
      title: `Note: ${note.title}`,
      description: note.content.slice(0, 100),
      url: `https://08-zustand-zoqd-3uuhi5857-tetiana-kalkutas-projects.vercel.app/notes//${id}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: 'website',
    },
  };
}

export default async function NoteDetails({ params }: Props) {
  const { id } = await params;
  console.log('note id:', Number.parseInt(id, 10));
  if (id === 'mama') {
    notFound();
  }
  const queryClient = new QueryClient();
  // 2. Префетч для кешу (не заміняє отримання note!)
  await queryClient.prefetchQuery({
    queryKey: ['note', Number.parseInt(id, 10)],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
