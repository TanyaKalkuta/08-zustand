'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import { createNote } from '@/lib/api';
import type { NoteTag } from '../../types/note';
import { useRouter } from 'next/navigation';
import { useNoteDraftStore } from '@/lib/store/noteStore';
import { useState } from 'react';

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, 'Min 3 characters')
    .max(50, 'Max 50 characters')
    .required('Required'),
  content: Yup.string().max(500, 'Max 500 characters'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Required'),
});

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  // 2. Викликаємо хук і отримуємо значення
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  //Додаємо state для помилок
  const [errors, setErrors] = useState<Record<string, string>>({});
  // 3. Оголошуємо функцію для onChange щоб при зміні будь-якого
  // елемента форми оновити чернетку нотатки в сторі
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    // 4. Коли користувач змінює будь-яке поле форми — оновлюємо стан
    setDraft({
      ...draft,
      [name]: value,
    });
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ['createNote'],
    mutationFn: createNote,
    // 5. При успішному створенні нотатки очищуємо чернетку
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push(`/notes/filter/all`);
    },
  });

  const handleCancel = () => router.push('/notes/filter/all');

  const handleSubmit = async (formData: FormData) => {
    // const values = Object.fromEntries(formData) as NewNote;
    // mutate(values);
    const values: NoteFormValues = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tag: formData.get('tag') as NoteTag,
    };

    try {
      setErrors({}); // очищаємо старі помилки
      await validationSchema.validate(values, { abortEarly: false });
      mutate(values);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const formErrors: Record<string, string> = {};
        err.inner.forEach((e: Yup.ValidationError) => {
          if (e.path) formErrors[e.path] = e.message;
        });
        setErrors(formErrors);
      }
    }
  };

  // 6. До кожного елемента додаємо value та onChange
  // щоб задати початкове значення із чернетки
  // та при зміні оновити чернетку в сторі
  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          value={draft?.title}
          onChange={handleChange}
          id="title"
          type="text"
          name="title"
          className={css.input}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          value={draft?.content}
          onChange={handleChange}
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          value={draft?.tag}
          onChange={handleChange}
          id="tag"
          name="tag"
          className={css.select}
        >
          {' '}
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancel
        </button>

        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}
