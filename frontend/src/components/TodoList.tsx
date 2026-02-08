/**
 * TodoList Component - Display array of todos
 * Feature: 003-nextjs-frontend-integration
 * Agent: frontend-agent
 */

'use client';

import { Todo, TodoUpdateRequest } from '@/lib/types';
import TodoItem from './TodoItem';
import { useState, useEffect, useRef } from 'react';

interface TodoListProps {
  todos: Todo[];
  onEdit: (id: string, data: TodoUpdateRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleComplete: (id: string) => Promise<void>;
}

export default function TodoList({
  todos,
  onEdit,
  onDelete,
  onToggleComplete,
}: TodoListProps) {
  const [itemHeights, setItemHeights] = useState<Record<string, number>>({});
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Calculate row spans based on content height
  useEffect(() => {
    const newHeights: Record<string, number> = {};
    todos.forEach((todo) => {
      const element = itemRefs.current[todo.id];
      if (element) {
        const height = element.offsetHeight;
        // Calculate row span: divide height by 20px (base row height) and add 1 for gap
        const rowSpan = Math.ceil(height / 20) + 1;
        newHeights[todo.id] = rowSpan;
      }
    });
    setItemHeights(newHeights);
  }, [todos]);

  if (todos.length === 0) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 shadow-sm rounded-lg p-8 text-center">
        <p className="text-slate-400 text-lg">
          No todos yet. Create your first task!
        </p>
      </div>
    );
  }

  return (
    <div
      className="masonry-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gridAutoRows: '20px',
        gap: '1rem',
      }}
    >
      {todos.map((todo, index) => (
        <div
          key={todo.id}
          ref={(el) => {
            itemRefs.current[todo.id] = el;
          }}
          className="animate-fade-in"
          style={{
            gridRowEnd: itemHeights[todo.id] ? `span ${itemHeights[todo.id]}` : 'auto',
            animationDelay: `${index * 50}ms`,
          }}
        >
          <TodoItem
            todo={todo}
            onEdit={(data) => onEdit(todo.id, data)}
            onDelete={() => onDelete(todo.id)}
            onToggleComplete={() => onToggleComplete(todo.id)}
          />
        </div>
      ))}
    </div>
  );
}
