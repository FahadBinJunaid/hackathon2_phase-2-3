/**
 * Delete Confirmation Modal Component
 * Feature: UI Refinement - Custom Delete Modal
 */

'use client';

import { useEffect } from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  todoTitle?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  todoTitle,
}: DeleteConfirmModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div
          className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-500/10 rounded-full">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>

          {/* Title */}
          <h3
            id="delete-modal-title"
            className="text-xl font-bold text-slate-200 text-center mb-2"
          >
            Delete Todo?
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-400 text-center mb-6">
            {todoTitle ? (
              <>
                Are you sure you want to delete <span className="font-semibold text-slate-100">"{todoTitle}"</span>? This action cannot be undone.
              </>
            ) : (
              'Are you sure you want to remove this task? This action cannot be undone.'
            )}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 btn-glass-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 btn-glass-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
