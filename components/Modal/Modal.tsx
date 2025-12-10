'use client';
import css from './Modal.module.css';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

interface ModalProps {
  // isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  useEffect(() => {
    // if (!isOpen) return; // ❗важливо: хук запускається завжди, але логіка — тільки коли модалка відкрита
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
