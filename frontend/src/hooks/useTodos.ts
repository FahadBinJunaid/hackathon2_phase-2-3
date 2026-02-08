/**
 * useTodos hook - Todo CRUD operations
 * Feature: 003-nextjs-frontend-integration
 * Agent: frontend-agent
 */

'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Todo, TodoCreateRequest, TodoUpdateRequest } from '@/lib/types';
import toast from 'react-hot-toast';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos on mount
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Todo[]>('/todos');
      setTodos(response.data);
    } catch (err: any) {
      const message = 'Failed to fetch todos';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Create new todo
  const createTodo = async (data: TodoCreateRequest) => {
    try {
      const response = await api.post<Todo>('/todos', data);
      setTodos([...todos, response.data]);
      toast.success('Todo created successfully!');
      return response.data;
    } catch (err: any) {
      toast.error('Failed to create todo');
      throw err;
    }
  };

  // Update existing todo
  const updateTodo = async (id: string, data: TodoUpdateRequest) => {
    try {
      const response = await api.put<Todo>(`/todos/${id}`, data);
      setTodos(todos.map((t) => (t.id === id ? response.data : t)));
      toast.success('Todo updated successfully!');
      return response.data;
    } catch (err: any) {
      toast.error('Failed to update todo');
      throw err;
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
      toast.success('Todo deleted successfully!');
    } catch (err: any) {
      toast.error('Failed to delete todo');
      throw err;
    }
  };

  // Toggle completion status with optimistic update
  const toggleComplete = async (id: string) => {
    // Optimistic update
    const originalTodos = [...todos];
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, is_completed: !t.is_completed } : t
      )
    );

    try {
      const response = await api.patch<Todo>(`/todos/${id}/complete`);
      setTodos(todos.map((t) => (t.id === id ? response.data : t)));
    } catch (err: any) {
      // Revert on error
      setTodos(originalTodos);
      toast.error('Failed to update todo');
      throw err;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  };
}
