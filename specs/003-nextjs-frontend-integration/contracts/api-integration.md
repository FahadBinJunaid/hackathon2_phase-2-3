# API Integration Contract: Frontend-Backend Communication

**Feature**: 003-nextjs-frontend-integration
**Date**: 2026-02-07
**Backend API**: http://localhost:8001
**Frontend**: http://localhost:3000

## Overview

This document defines how the Next.js frontend integrates with the FastAPI backend. All API endpoints, request/response formats, and error handling patterns are documented here.

## Base Configuration

### Environment Variables

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Axios Configuration

```typescript
// src/lib/api.ts
import axios from 'axios';
import { getToken, clearToken } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Authentication Endpoints

### POST /auth/signup

**Purpose**: Create a new user account

**Request**:
```typescript
POST http://localhost:8001/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Success Response (201 Created)**:
```typescript
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses**:
- **409 Conflict**: Email already registered
  ```json
  { "detail": "Email already registered" }
  ```
- **422 Unprocessable Entity**: Validation error
  ```json
  {
    "detail": [
      {
        "loc": ["body", "password"],
        "msg": "ensure this value has at least 8 characters",
        "type": "value_error.any_str.min_length"
      }
    ]
  }
  ```

**Frontend Implementation**:
```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const signup = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', {
        email,
        password,
      });
      setToken(response.data.access_token);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      throw error;
    }
  };

  return { signup };
}
```

---

### POST /auth/login

**Purpose**: Authenticate existing user

**Request**:
```typescript
POST http://localhost:8001/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Success Response (200 OK)**:
```typescript
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses**:
- **401 Unauthorized**: Invalid credentials
  ```json
  { "detail": "Invalid email or password" }
  ```

**Frontend Implementation**:
```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      setToken(response.data.access_token);
      toast.success('Logged in successfully!');
      router.push('/dashboard');
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      throw error;
    }
  };

  return { login };
}
```

---

## Todo Endpoints

### GET /todos

**Purpose**: Fetch all todos for authenticated user

**Request**:
```typescript
GET http://localhost:8001/todos
Authorization: Bearer <jwt_token>
```

**Success Response (200 OK)**:
```typescript
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "is_completed": false,
    "created_at": "2026-02-07T12:00:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Review pull requests",
    "description": null,
    "is_completed": true,
    "created_at": "2026-02-06T10:30:00Z"
  }
]
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid token
  ```json
  { "detail": "Not authenticated" }
  ```

**Frontend Implementation**:
```typescript
// src/hooks/useTodos.ts
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await api.get<Todo[]>('/todos');
      setTodos(response.data);
    } catch (error) {
      toast.error('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return { todos, loading, fetchTodos };
}
```

---

### POST /todos

**Purpose**: Create a new todo

**Request**:
```typescript
POST http://localhost:8001/todos
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation"
}
```

**Success Response (201 Created)**:
```typescript
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "is_completed": false,
  "created_at": "2026-02-07T12:00:00Z"
}
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid token
- **422 Unprocessable Entity**: Missing title or validation error

**Frontend Implementation**:
```typescript
// src/hooks/useTodos.ts
const createTodo = async (data: TodoCreateRequest) => {
  try {
    const response = await api.post<Todo>('/todos', data);
    setTodos([...todos, response.data]);
    toast.success('Todo created successfully!');
    return response.data;
  } catch (error) {
    toast.error('Failed to create todo');
    throw error;
  }
};
```

---

### PUT /todos/{id}

**Purpose**: Update an existing todo

**Request**:
```typescript
PUT http://localhost:8001/todos/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description"
}
```

**Success Response (200 OK)**:
```typescript
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Updated title",
  "description": "Updated description",
  "is_completed": false,
  "created_at": "2026-02-07T12:00:00Z"
}
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid token
- **404 Not Found**: Todo doesn't exist or user doesn't own it

**Frontend Implementation**:
```typescript
// src/hooks/useTodos.ts
const updateTodo = async (id: string, data: TodoUpdateRequest) => {
  try {
    const response = await api.put<Todo>(`/todos/${id}`, data);
    setTodos(todos.map(t => t.id === id ? response.data : t));
    toast.success('Todo updated successfully!');
    return response.data;
  } catch (error) {
    toast.error('Failed to update todo');
    throw error;
  }
};
```

---

### DELETE /todos/{id}

**Purpose**: Delete a todo

**Request**:
```typescript
DELETE http://localhost:8001/todos/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <jwt_token>
```

**Success Response (204 No Content)**:
```
(No response body)
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid token
- **404 Not Found**: Todo doesn't exist or user doesn't own it

**Frontend Implementation**:
```typescript
// src/hooks/useTodos.ts
const deleteTodo = async (id: string) => {
  try {
    await api.delete(`/todos/${id}`);
    setTodos(todos.filter(t => t.id !== id));
    toast.success('Todo deleted successfully!');
  } catch (error) {
    toast.error('Failed to delete todo');
    throw error;
  }
};
```

---

### PATCH /todos/{id}/complete

**Purpose**: Toggle todo completion status

**Request**:
```typescript
PATCH http://localhost:8001/todos/550e8400-e29b-41d4-a716-446655440000/complete
Authorization: Bearer <jwt_token>
```

**Success Response (200 OK)**:
```typescript
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "is_completed": true,
  "created_at": "2026-02-07T12:00:00Z"
}
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid token
- **404 Not Found**: Todo doesn't exist or user doesn't own it

**Frontend Implementation (with Optimistic Update)**:
```typescript
// src/hooks/useTodos.ts
const toggleComplete = async (id: string) => {
  // Optimistic update
  setTodos(todos.map(t =>
    t.id === id ? { ...t, is_completed: !t.is_completed } : t
  ));

  try {
    const response = await api.patch<Todo>(`/todos/${id}/complete`);
    setTodos(todos.map(t => t.id === id ? response.data : t));
  } catch (error) {
    // Revert on error
    setTodos(todos.map(t =>
      t.id === id ? { ...t, is_completed: !t.is_completed } : t
    ));
    toast.error('Failed to update todo');
    throw error;
  }
};
```

---

## Error Handling Patterns

### Global Error Handler

```typescript
// src/lib/api.ts
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

### HTTP Status Code Handling

| Status Code | Meaning | Frontend Action |
|-------------|---------|-----------------|
| 200 OK | Success | Display success toast, update UI |
| 201 Created | Resource created | Display success toast, add to list |
| 204 No Content | Success (no body) | Display success toast, remove from list |
| 401 Unauthorized | Invalid/missing token | Clear token, redirect to /login |
| 404 Not Found | Resource not found | Display error toast |
| 409 Conflict | Duplicate resource | Display error toast with specific message |
| 422 Validation Error | Invalid input | Display inline validation errors |
| 500 Server Error | Backend error | Display generic error toast |

---

## CORS Configuration

### Backend Requirements

The backend must allow requests from the frontend origin:

```python
# backend/.env
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

```python
# backend/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Testing CORS

```bash
# Test CORS with curl
curl -X OPTIONS http://localhost:8001/todos \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v
```

Expected response headers:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
```

---

## Multi-Tenant Isolation

### How It Works

1. **JWT Token**: Contains `user_id` in payload
2. **Backend Filtering**: All GET /todos queries filtered by `user_id` from JWT
3. **Ownership Verification**: PUT/DELETE/PATCH operations verify ownership
4. **Frontend**: Never displays data from other users (backend enforces this)

### Testing Multi-Tenant Isolation

```typescript
// Test script
async function testMultiTenant() {
  // User A: Signup and create todos
  const userA = await signup('usera@example.com', 'password123');
  const todoA1 = await createTodo({ title: 'User A Todo 1' });
  const todoA2 = await createTodo({ title: 'User A Todo 2' });

  // User B: Signup and verify empty list
  const userB = await signup('userb@example.com', 'password123');
  const todosB = await fetchTodos(); // Should be empty array

  console.assert(todosB.length === 0, 'User B should not see User A todos');

  // User B: Create todo
  const todoB1 = await createTodo({ title: 'User B Todo 1' });

  // User A: Login again and verify only A's todos
  await login('usera@example.com', 'password123');
  const todosA = await fetchTodos(); // Should have 2 todos

  console.assert(todosA.length === 2, 'User A should see only their todos');
  console.assert(!todosA.find(t => t.id === todoB1.id), 'User A should not see User B todo');
}
```

---

## Performance Optimization

### Request Batching

For future optimization, consider batching multiple todo operations:

```typescript
// Not implemented in MVP, but possible future enhancement
const batchUpdate = async (updates: Array<{ id: string; data: TodoUpdateRequest }>) => {
  const promises = updates.map(({ id, data }) => api.put(`/todos/${id}`, data));
  const results = await Promise.all(promises);
  return results.map(r => r.data);
};
```

### Caching Strategy

```typescript
// Simple in-memory cache for todos (optional)
let todosCache: Todo[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 60000; // 1 minute

const fetchTodosWithCache = async () => {
  const now = Date.now();
  if (todosCache && (now - cacheTimestamp) < CACHE_TTL) {
    return todosCache;
  }

  const response = await api.get<Todo[]>('/todos');
  todosCache = response.data;
  cacheTimestamp = now;
  return todosCache;
};
```

---

## Security Considerations

### JWT Token Handling

- **Storage**: localStorage (acceptable for MVP, migrate to httpOnly cookies for production)
- **Transmission**: Always in Authorization header, never in URL
- **Expiration**: 7 days (backend configured)
- **Validation**: Backend validates signature and expiration

### XSS Prevention

- React automatically escapes JSX content
- Never use `dangerouslySetInnerHTML` with user input
- Sanitize user inputs before display

### CSRF Protection

- Not required: JWT in Authorization header (not cookies) prevents CSRF
- Backend does not use session cookies

---

## Testing Checklist

### API Integration Tests

- [ ] Signup with valid credentials → 201 Created
- [ ] Signup with duplicate email → 409 Conflict
- [ ] Login with correct credentials → 200 OK
- [ ] Login with wrong password → 401 Unauthorized
- [ ] Fetch todos with valid token → 200 OK
- [ ] Fetch todos without token → 401 Unauthorized
- [ ] Create todo with valid data → 201 Created
- [ ] Create todo without title → 422 Validation Error
- [ ] Update todo (owned) → 200 OK
- [ ] Update todo (not owned) → 404 Not Found
- [ ] Delete todo (owned) → 204 No Content
- [ ] Delete todo (not owned) → 404 Not Found
- [ ] Toggle complete (owned) → 200 OK
- [ ] Toggle complete (not owned) → 404 Not Found

### Multi-Tenant Tests

- [ ] User A creates todos
- [ ] User B sees empty list
- [ ] User B creates todo
- [ ] User A sees only A's todos
- [ ] User B sees only B's todos

### Error Handling Tests

- [ ] Network error → User-friendly message
- [ ] 401 error → Auto-logout and redirect
- [ ] 404 error → Error toast
- [ ] 422 error → Inline validation errors
- [ ] 500 error → Generic error toast

---

## Summary

All API endpoints are documented with request/response formats, error handling, and frontend implementation examples. The integration uses Axios with interceptors for centralized JWT handling and error management. Multi-tenant isolation is enforced by the backend and verified by frontend tests.

**Key Points**:
- All requests include JWT token in Authorization header
- 401 errors trigger automatic logout and redirect
- Error messages are user-friendly and actionable
- Optimistic updates provide immediate feedback
- Multi-tenant isolation is verified through testing
