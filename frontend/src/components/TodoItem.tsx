/**
 * TodoItem Component - Individual todo with actions
 * Feature: 003-nextjs-frontend-integration
 * Agent: frontend-agent
 */

'use client';

import { useState } from 'react';
import { Todo, TodoUpdateRequest } from '@/lib/types';
import DeleteConfirmModal from './DeleteConfirmModal';

interface TodoItemProps {
  todo: Todo;
  onEdit: (data: TodoUpdateRequest) => Promise<void>;
  onDelete: () => Promise<void>;
  onToggleComplete: () => Promise<void>;
}

export default function TodoItem({
  todo,
  onEdit,
  onDelete,
  onToggleComplete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    if (!editTitle.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onEdit({
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in useTodos hook
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await onDelete();
    } catch (error) {
      // Error handling is done in useTodos hook
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    try {
      await onToggleComplete();
    } catch (error) {
      // Error handling is done in useTodos hook
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-teal-500 shadow-sm rounded-lg p-4">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-700 rounded-md bg-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Title"
            maxLength={255}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-slate-700 rounded-md bg-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Description (optional)"
            maxLength={1000}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="flex-1 btn-glass-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={loading}
              className="flex-1 btn-glass-secondary disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 shadow-sm rounded-lg p-4 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={handleToggleComplete}
          className="mt-1 h-5 w-5 text-teal-400 focus:ring-teal-400 border-slate-700 rounded cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-bold ${
              todo.is_completed
                ? 'line-through text-slate-500'
                : 'text-slate-200'
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p
              className={`mt-1 text-sm ${
                todo.is_completed ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {todo.description}
            </p>
          )}
          <p className="mt-2 text-xs text-slate-500">
            Created: {new Date(todo.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="text-teal-400 hover:text-teal-300 font-semibold text-sm px-3 py-1 rounded-md hover:bg-teal-500/10 disabled:opacity-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={loading}
            className="text-red-400 hover:text-red-300 font-semibold text-sm px-3 py-1 rounded-md hover:bg-red-500/10 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        todoTitle={todo.title}
      />
    </div>
  );
}
