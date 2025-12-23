import css from './Home.module.css';
import { Metadata } from 'next';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { BASE_URL } from '@/lib/config/constants';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'This page does not exist.',
  openGraph: {
    title: 'Page Not Found',
    description: 'This page does not exist.',
    // url: BASE_URL,
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub',
      },
    ],
  },
};

const NotFound = () => {
  // const router = useRouter();

  // useEffect(() => {
  //   // Редірект через 3 секунди
  //   const timer = setTimeout(() => router.push('/'), 3000);
  //   return () => clearTimeout(timer);
  // }, [router]);

  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.{' '}
      </p>
      {/* <Link href="/">Go back home</Link> */}
    </>
  );
};

export default NotFound;
