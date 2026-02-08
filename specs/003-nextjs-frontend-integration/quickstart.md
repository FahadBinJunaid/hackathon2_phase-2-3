# Quickstart Guide: Phase 2 – Sprint C: Frontend UI & Backend Integration

**Feature**: 003-nextjs-frontend-integration
**Date**: 2026-02-07

## Overview

This quickstart guide provides step-by-step instructions to set up and run the Next.js frontend that integrates with the FastAPI backend. Follow these steps to get the application running locally.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- FastAPI backend running on http://localhost:8001 (from Sprint B)
- Backend CORS configured to allow http://localhost:3000

## Setup Instructions

### 1. Verify Backend is Running

Before starting the frontend, ensure the backend is accessible:

```bash
# Test backend health endpoint
curl http://localhost:8001/health
```

Expected response:
```json
{
  "status": "healthy"
}
```

If the backend is not running, start it first:

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

### 2. Verify CORS Configuration

Check that the backend allows requests from http://localhost:3000:

```bash
# Check backend/.env file
cat backend/.env | grep CORS_ORIGINS
```

Expected output:
```
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

If CORS_ORIGINS is missing or incorrect, update backend/.env:

```bash
echo "CORS_ORIGINS=http://localhost:3000,http://localhost:8000" >> backend/.env
```

Then restart the backend server.

### 3. Create Next.js Project

From the project root directory:

```bash
# Create Next.js project with TypeScript and Tailwind CSS
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir --no-git

# Navigate to frontend directory
cd frontend
```

When prompted, select:
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ `src/` directory: Yes
- ✅ App Router: Yes
- ❌ Import alias: No (use default @/*)

### 4. Install Dependencies

```bash
# Install Axios for API calls
npm install axios

# Install React Hot Toast for notifications
npm install react-hot-toast

# Install development dependencies (optional)
npm install -D @types/node
```

### 5. Create Environment Variables

Create `.env.local` file in the frontend directory:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8001
```

**Important**: The `NEXT_PUBLIC_` prefix is required for environment variables that need to be accessible in the browser.

### 6. Verify Installation

```bash
# Check that all dependencies are installed
npm list axios react-hot-toast

# Expected output:
# frontend@0.1.0
# ├── axios@1.6.5
# └── react-hot-toast@2.4.1
```

## Running the Application

### Start Development Server

```bash
# From frontend directory
npm run dev
```

Expected output:
```
   ▲ Next.js 14.1.0
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Ready in 2.3s
```

### Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the default Next.js landing page.

## Development Workflow

### 1. Create API Client

Create `src/lib/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
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
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Create TypeScript Types

Create `src/lib/types.ts`:

```typescript
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
}

export interface TodoCreateRequest {
  title: string;
  description?: string;
}

export interface TodoUpdateRequest {
  title?: string;
  description?: string;
}
```

### 3. Create Auth Helpers

Create `src/lib/auth.ts`:

```typescript
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('auth_token');
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
```

### 4. Test API Connection

Create a test page to verify API connectivity:

```typescript
// src/app/test/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function TestPage() {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    api.get('/health')
      .then(() => setStatus('✅ Backend connected!'))
      .catch(() => setStatus('❌ Backend not reachable'));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">API Connection Test</h1>
      <p className="mt-4">{status}</p>
    </div>
  );
}
```

Visit http://localhost:3000/test to verify the connection.

## Testing the Application

### 1. Test Authentication Flow

**Signup**:
1. Navigate to http://localhost:3000/signup (after implementing signup page)
2. Enter email: `test@example.com`
3. Enter password: `password123` (min 8 characters)
4. Click "Sign Up"
5. Verify redirect to /dashboard
6. Check localStorage for `auth_token`

**Login**:
1. Navigate to http://localhost:3000/login
2. Enter credentials from signup
3. Click "Log In"
4. Verify redirect to /dashboard

**Logout**:
1. Click "Logout" button in navbar
2. Verify redirect to /login
3. Verify `auth_token` removed from localStorage

### 2. Test Todo CRUD Operations

**Create Todo**:
1. On dashboard, enter title: "Test Todo"
2. Enter description: "This is a test"
3. Click "Create"
4. Verify todo appears in list

**Edit Todo**:
1. Click "Edit" button on a todo
2. Modify title or description
3. Click "Save"
4. Verify changes persist after page refresh

**Toggle Complete**:
1. Click checkbox on a todo
2. Verify visual feedback (strikethrough or color change)
3. Refresh page
4. Verify completion status persists

**Delete Todo**:
1. Click "Delete" button on a todo
2. Confirm deletion
3. Verify todo removed from list
4. Refresh page
5. Verify todo is permanently deleted

### 3. Test Multi-Tenant Isolation

**User A**:
1. Signup as `usera@example.com`
2. Create 3 todos
3. Logout

**User B**:
1. Signup as `userb@example.com`
2. Verify empty todo list (should not see User A's todos)
3. Create 1 todo
4. Logout

**User A Again**:
1. Login as `usera@example.com`
2. Verify only User A's 3 todos are visible
3. Verify User B's todo is not visible

### 4. Test Responsive Design

**Mobile (320px)**:
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone SE" or set width to 320px
4. Verify layout adapts correctly
5. Verify forms are usable
6. Verify buttons are tappable (min 44x44px)

**Tablet (768px)**:
1. Set width to 768px in DevTools
2. Verify layout utilizes space effectively
3. Verify navigation is accessible

**Desktop (1024px+)**:
1. Set width to 1024px or larger
2. Verify optimal layout and spacing
3. Verify all features accessible

## Troubleshooting

### Issue: "Cannot connect to backend"

**Symptoms**: API calls fail with network error

**Solutions**:
1. Verify backend is running: `curl http://localhost:8001/health`
2. Check CORS configuration in backend/.env
3. Restart backend server after CORS changes
4. Check browser console for CORS errors

### Issue: "401 Unauthorized on all requests"

**Symptoms**: Immediately redirected to /login after authentication

**Solutions**:
1. Check JWT_SECRET in backend/.env matches
2. Verify token is stored in localStorage: `localStorage.getItem('auth_token')`
3. Check token expiration (7 days from creation)
4. Clear localStorage and login again

### Issue: "Module not found" errors

**Symptoms**: Import errors in TypeScript files

**Solutions**:
1. Verify all dependencies installed: `npm install`
2. Check tsconfig.json paths configuration
3. Restart Next.js dev server: `npm run dev`
4. Clear Next.js cache: `rm -rf .next && npm run dev`

### Issue: "Hydration errors" in console

**Symptoms**: React hydration mismatch warnings

**Solutions**:
1. Ensure Server Components don't use client-side APIs (localStorage, window)
2. Add 'use client' directive to components using hooks or browser APIs
3. Use `useEffect` for client-side only code
4. Check for mismatched HTML structure between server and client

### Issue: "localStorage is not defined"

**Symptoms**: Error when accessing localStorage in Server Components

**Solutions**:
1. Add 'use client' directive to component
2. Check for `typeof window !== 'undefined'` before accessing localStorage
3. Move localStorage access to `useEffect` hook

### Issue: "CORS policy error"

**Symptoms**: Browser blocks API requests with CORS error

**Solutions**:
1. Verify CORS_ORIGINS in backend/.env includes http://localhost:3000
2. Restart backend server after changing .env
3. Check browser console for specific CORS error
4. Test CORS with curl:
   ```bash
   curl -X OPTIONS http://localhost:8001/todos \
     -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -v
   ```

## Development Tips

### Hot Reload

Next.js automatically reloads when you save files. If hot reload stops working:

```bash
# Restart dev server
npm run dev
```

### TypeScript Errors

Check for TypeScript errors:

```bash
# Run TypeScript compiler
npx tsc --noEmit
```

### Linting

Run ESLint to check code quality:

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Build for Production

Test production build locally:

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Next Steps

Once the basic setup is complete:

1. **Implement Authentication Pages**: Create signup and login pages with forms
2. **Add Route Protection**: Implement middleware or client-side protection for /dashboard
3. **Build Dashboard**: Create todo list, form, and item components
4. **Add Loading States**: Implement skeleton screens and spinners
5. **Implement Error Handling**: Add toast notifications for all operations
6. **Test Responsive Design**: Verify layout on all screen sizes
7. **Verify Multi-Tenant Isolation**: Test with multiple users

## Verification Checklist

Before proceeding to implementation:

- [ ] Node.js 18+ installed
- [ ] Backend running on http://localhost:8001
- [ ] Backend health endpoint accessible
- [ ] CORS configured for http://localhost:3000
- [ ] Next.js project created with TypeScript and Tailwind
- [ ] Dependencies installed (axios, react-hot-toast)
- [ ] .env.local created with NEXT_PUBLIC_API_URL
- [ ] Dev server runs without errors
- [ ] Test page connects to backend successfully

## Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Axios Documentation**: https://axios-http.com/docs/intro
- **React Hot Toast**: https://react-hot-toast.com/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

## Support

If you encounter issues not covered in this guide:

1. Check the backend logs for API errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed
5. Try clearing Next.js cache and rebuilding

---

**Ready to proceed?** Once all verification checklist items are complete, you can start implementing the authentication pages and dashboard components following the implementation plan in `plan.md`.
