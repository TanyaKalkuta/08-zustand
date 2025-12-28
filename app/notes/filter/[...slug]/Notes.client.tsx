'use client';
import { useState } from 'react';
import css from './NotesPage.module.css';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebounce } from 'use-debounce';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import fetchNotes from '@/lib/api';
import Link from 'next/link';

interface Props {
  tag?: string;
}
function NotesClient({ tag }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [debounceValue] = useDebounce(search, 1000);

  const { data } = useQuery({
    queryKey: ['notes', debounceValue, page, tag],
    queryFn: () => fetchNotes(debounceValue, page, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {
          <SearchBox
            onChange={value => {
              setSearch(value);
              setPage(1);
            }}
          />
        }

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        data && <p>Nothing found</p>
      )}
    </div>
  );
}

export default NotesClient;
