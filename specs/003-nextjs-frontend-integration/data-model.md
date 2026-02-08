# Data Model: Phase 2 – Sprint C: Frontend UI & Backend Integration

**Feature**: 003-nextjs-frontend-integration
**Date**: 2026-02-07
**Phase**: Phase 1 - Design

## Overview

This document defines the TypeScript interfaces and data structures used in the Next.js frontend. All types are derived from the backend API contracts and ensure type safety throughout the application.

## TypeScript Interfaces

### Authentication Types

```typescript
/**
 * User authentication credentials for signup
 */
export interface SignupRequest {
  email: string;        // Valid email format
  password: string;     // Minimum 8 characters
}

/**
 * User authentication credentials for login
 */
export interface LoginRequest {
  email: string;        // Registered email address
  password: string;     // User's password
}

/**
 * Authentication response from backend
 */
export interface AuthResponse {
  access_token: string; // JWT token
  token_type: string;   // Always "bearer"
}

/**
 * Decoded JWT token payload (for reference, not used directly)
 */
export interface JWTPayload {
  user_id: string;      // UUID as string
  email: string;        // User's email
  exp: number;          // Expiration timestamp (Unix epoch)
}
```

### Todo Types

```typescript
/**
 * Todo item as returned from backend API
 */
export interface Todo {
  id: string;                    // UUID as string
  user_id: string;               // UUID as string (owner)
  title: string;                 // Max 255 characters
  description: string | null;    // Max 1000 characters, optional
  is_completed: boolean;         // Completion status
  created_at: string;            // ISO 8601 timestamp
}

/**
 * Request payload for creating a new todo
 */
export interface TodoCreateRequest {
  title: string;                 // Required, max 255 characters
  description?: string;          // Optional, max 1000 characters
}

/**
 * Request payload for updating an existing todo
 */
export interface TodoUpdateRequest {
  title?: string;                // Optional, max 255 characters
  description?: string;          // Optional, max 1000 characters
}

/**
 * Response from todo list endpoint
 */
export type TodoListResponse = Todo[];
```

### Error Types

```typescript
/**
 * Standard error response from backend
 */
export interface ApiError {
  detail: string;                // Human-readable error message
}

/**
 * Validation error response (422 status)
 */
export interface ValidationError {
  detail: Array<{
    loc: string[];               // Field location (e.g., ["body", "email"])
    msg: string;                 // Error message
    type: string;                // Error type (e.g., "value_error.email")
  }>;
}
```

### UI State Types

```typescript
/**
 * Loading state for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Form validation errors
 */
export interface FormErrors {
  email?: string;
  password?: string;
  title?: string;
  description?: string;
}

/**
 * Auth context state (if using Context API)
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
  } | null;
  loading: boolean;
}

/**
 * Todo list state
 */
export interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}
```

## Data Flow

### Authentication Flow

```
User Input (email, password)
  ↓
SignupRequest / LoginRequest
  ↓
POST /auth/signup or POST /auth/login
  ↓
AuthResponse { access_token, token_type }
  ↓
localStorage.setItem('auth_token', access_token)
  ↓
Redirect to /dashboard
```

### Todo CRUD Flow

```
Dashboard Page Load
  ↓
GET /todos (with JWT in Authorization header)
  ↓
TodoListResponse (array of Todo objects)
  ↓
Display in TodoList component
  ↓
User Actions:
  - Create: TodoCreateRequest → POST /todos → Todo
  - Update: TodoUpdateRequest → PUT /todos/{id} → Todo
  - Delete: DELETE /todos/{id} → 204 No Content
  - Toggle: PATCH /todos/{id}/complete → Todo
```

### State Management Pattern

```typescript
// Custom hook pattern for todos
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await api.get<TodoListResponse>('/todos');
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (data: TodoCreateRequest) => {
    const response = await api.post<Todo>('/todos', data);
    setTodos([...todos, response.data]);
    return response.data;
  };

  const updateTodo = async (id: string, data: TodoUpdateRequest) => {
    const response = await api.put<Todo>(`/todos/${id}`, data);
    setTodos(todos.map(t => t.id === id ? response.data : t));
    return response.data;
  };

  const deleteTodo = async (id: string) => {
    await api.delete(`/todos/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleComplete = async (id: string) => {
    // Optimistic update
    setTodos(todos.map(t =>
      t.id === id ? { ...t, is_completed: !t.is_completed } : t
    ));

    try {
      const response = await api.patch<Todo>(`/todos/${id}/complete`);
      setTodos(todos.map(t => t.id === id ? response.data : t));
    } catch (err) {
      // Revert on error
      setTodos(todos.map(t =>
        t.id === id ? { ...t, is_completed: !t.is_completed } : t
      ));
      throw err;
    }
  };

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
```

## Validation Rules

### Client-Side Validation

```typescript
/**
 * Validate email format
 */
export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
}

/**
 * Validate password length
 */
export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

/**
 * Validate todo title
 */
export function validateTitle(title: string): string | null {
  if (!title) return 'Title is required';
  if (title.length > 255) return 'Title must be less than 255 characters';
  return null;
}

/**
 * Validate todo description
 */
export function validateDescription(description: string): string | null {
  if (description && description.length > 1000) {
    return 'Description must be less than 1000 characters';
  }
  return null;
}
```

## Data Transformations

### Date Formatting

```typescript
/**
 * Format ISO 8601 timestamp to human-readable date
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format ISO 8601 timestamp to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}
```

### Error Message Extraction

```typescript
/**
 * Extract user-friendly error message from API error
 */
export function extractErrorMessage(error: any): string {
  if (error.response?.data?.detail) {
    // Standard error response
    if (typeof error.response.data.detail === 'string') {
      return error.response.data.detail;
    }

    // Validation error response
    if (Array.isArray(error.response.data.detail)) {
      const firstError = error.response.data.detail[0];
      return firstError.msg || 'Validation error';
    }
  }

  // Network error
  if (error.message === 'Network Error') {
    return 'Unable to connect to server. Please check your connection.';
  }

  // Generic error
  return 'An unexpected error occurred. Please try again.';
}
```

## Component Props Types

### Navbar Props

```typescript
export interface NavbarProps {
  // No props needed - uses useAuth hook internally
}
```

### TodoForm Props

```typescript
export interface TodoFormProps {
  onSubmit: (data: TodoCreateRequest) => Promise<void>;
  loading?: boolean;
}
```

### TodoList Props

```typescript
export interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onEdit: (id: string, data: TodoUpdateRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleComplete: (id: string) => Promise<void>;
}
```

### TodoItem Props

```typescript
export interface TodoItemProps {
  todo: Todo;
  onEdit: (data: TodoUpdateRequest) => Promise<void>;
  onDelete: () => Promise<void>;
  onToggleComplete: () => Promise<void>;
}
```

### LoadingSkeleton Props

```typescript
export interface LoadingSkeletonProps {
  count?: number;        // Number of skeleton items to display
  height?: string;       // Height of each skeleton item (e.g., "80px")
}
```

## Local Storage Schema

### Auth Token Storage

```typescript
// Key: 'auth_token'
// Value: JWT token string
// Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

/**
 * Get auth token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Set auth token in localStorage
 */
export function setToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

/**
 * Clear auth token from localStorage
 */
export function clearToken(): void {
  localStorage.removeItem('auth_token');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
```

## Type Guards

```typescript
/**
 * Type guard for API error
 */
export function isApiError(error: any): error is { response: { data: ApiError } } {
  return error?.response?.data?.detail !== undefined;
}

/**
 * Type guard for validation error
 */
export function isValidationError(error: any): error is { response: { data: ValidationError } } {
  return Array.isArray(error?.response?.data?.detail);
}
```

## Constants

```typescript
/**
 * API base URL from environment variable
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
} as const;

/**
 * Validation constraints
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  TITLE_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const;
```

## Summary

All data structures are strongly typed with TypeScript interfaces that match the backend API contracts. Client-side validation ensures data integrity before API calls. Custom hooks encapsulate business logic and provide clean interfaces for components. Error handling is centralized and provides user-friendly messages.

**Key Points**:
- All API responses are typed with TypeScript interfaces
- Validation rules match backend constraints
- Custom hooks manage state and API calls
- Error messages are user-friendly and actionable
- Local storage schema is documented and typed
