/**
 * TodoForm Component - Create new todos
 * Feature: 003-nextjs-frontend-integration
 * Agent: frontend-agent
 */

'use client';

import { useState, FormEvent } from 'react';
import { TodoCreateRequest } from '@/lib/types';

interface TodoFormProps {
  onSubmit: (data: TodoCreateRequest) => Promise<void>;
  loading?: boolean;
}

export default function TodoForm({ onSubmit, loading = false }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    // Description validation
    if (description && description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      // Clear form on success
      setTitle('');
      setDescription('');
      setErrors({});
    } catch (error) {
      // Error handling is done in useTodos hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 shadow-sm rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-slate-200 mb-4">Create New Todo</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-700 rounded-md bg-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            placeholder="Enter todo title"
            maxLength={255}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-700 rounded-md bg-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            placeholder="Enter todo description"
            maxLength={1000}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-glass-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Todo'}
        </button>
      </div>
    </form>
  );
}
