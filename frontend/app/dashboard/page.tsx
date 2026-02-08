/**
 * Dashboard Page - Todo Management
 * Feature: 003-nextjs-frontend-integration
 * Agent: frontend-agent
 */

'use client';

import { useTodos } from '@/hooks/useTodos';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function DashboardPage() {
  const {
    todos,
    loading,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  } = useTodos();

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-0">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          My Todo List
        </h1>
        <p className="text-slate-400">
          Manage your tasks efficiently
        </p>
      </div>

      <div className="space-y-6">
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <TodoForm onSubmit={async (data) => { await createTodo(data); }} loading={loading} />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {loading && todos.length === 0 ? (
            <LoadingSkeleton count={3} />
          ) : (
            <TodoList
              todos={todos}
              onEdit={updateTodo}
              onDelete={deleteTodo}
              onToggleComplete={toggleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
