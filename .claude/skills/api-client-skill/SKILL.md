---
name: api-client-skill
description: Centralized API communication layer. Use for making HTTP requests from frontend to backend.
---

# API Client Implementation

## Instructions

1. **Centralized Module**
   - Create /lib/api.ts file
   - Export functions for each endpoint
   - Handle authentication tokens

2. **Error Handling**
   - Catch network errors
   - Parse API error responses
   - Show user-friendly messages

3. **Token Management**
   - Get token from localStorage
   - Add to all requests
   - Handle token expiration

## Best Practices
- Type all API functions
- Use environment variables for API URL
- Implement request/response interceptors
- Handle loading states

## Example Implementation

```typescript
// /lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getToken() {
  return localStorage.getItem('token');
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'API request failed');
  }
  return response.json();
}

export const api = {
  // Tasks
  getTasks: (userId: string) => apiFetch(`/api/${userId}/tasks`),
  createTask: (userId: string, task: any) =>
    apiFetch(`/api/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    }),

  // Auth
  signin: (credentials: any) =>
    apiFetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};
```