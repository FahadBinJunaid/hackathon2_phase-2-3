---
name: nextjs-frontend-skill
description: Build modern web UIs with Next.js 16 App Router. Use for pages, components, and client interactions.
---

# Next.js Frontend Development

## Instructions

1. **App Router Structure**
   - Use /app directory for routing
   - Server Components by default
   - 'use client' only when needed

2. **Component Patterns**
   - Create reusable components in /components
   - Use TypeScript for type safety
   - Style with Tailwind CSS

3. **Data Fetching**
   - Server Components: fetch directly in component
   - Client Components: use useEffect or React Query
   - Centralize API calls in /lib/api.ts

4. **State Management**
   - Use useState for local state
   - Context for global state
   - Don't over-complicate

## Best Practices
- Keep components small and focused
- Use semantic HTML
- Optimize images with next/image
- Handle loading and error states

## Example Structure

```typescript
// Server Component (default)
export default async function TasksPage() {
  const tasks = await fetchTasks(); // Direct fetch
  return <TaskList tasks={tasks} />;
}

// Client Component (when needed)
'use client';
import { useState } from 'react';

export function TaskForm() {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.createTask({ title });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```