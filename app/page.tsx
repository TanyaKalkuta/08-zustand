import css from './Home.module.css';
// import Image from 'next/image';

export default function Home() {
  return (
    <div className={css.page}>
      <main className={css.main}>
        <div className={css.container}>
          <h1 className={css.title}>Welcome to NoteHub</h1>
          <p className={css.description}>
            NoteHub is a simple and efficient application designed for managing
            personal notes. It helps keep your thoughts organized and accessible
            in one place, whether you are at home or on the go.
          </p>
          <p className={css.description}>
            The app provides a clean interface for writing, editing, and
            browsing notes. With support for keyword search and structured
            organization, NoteHub offers a streamlined experience for anyone who
            values clarity and productivity.
            {/* <Image
              src="https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"
              alt="NoteHub"
              width={500}
              height={400}
              sizes="(max-width: 768px) 100vw, 50vw"
  priority   // зображення завантажується одразу, без lazy loading
  placeholder="blur"    //  додає ефект розмиття на час завантаження
            /> */}
          </p>
        </div>
      </main>
    </div>
  );
}
