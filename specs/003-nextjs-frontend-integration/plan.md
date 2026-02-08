# Implementation Plan: Phase 2 – Sprint C: Frontend UI & Backend Integration

**Branch**: `003-nextjs-frontend-integration` | **Date**: 2026-02-07 | **Spec**: [specs/003-nextjs-frontend-integration/spec.md](specs/003-nextjs-frontend-integration/spec.md)
**Input**: Feature specification from `/specs/003-nextjs-frontend-integration/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a responsive, modern Todo application UI using Next.js 16 App Router that integrates with the FastAPI backend. Implement user authentication with JWT tokens stored in localStorage, protected routes with middleware, complete CRUD operations for todos with multi-tenant isolation, and responsive design with loading states and error handling. The frontend will communicate with the backend API at http://localhost:8001 using Axios with automatic JWT header injection.

## Technical Context

**Language/Version**: TypeScript 5+ with Next.js 16 (App Router), React 18+
**Primary Dependencies**: Next.js 16, React 18+, TypeScript 5+, Tailwind CSS 3+, Axios, React Hot Toast
**Storage**: localStorage for JWT token storage (client-side), backend API for persistent data
**Testing**: Manual testing via browser, multi-tenant isolation verification, responsive design testing
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions), responsive design for mobile (320px+), tablet (768px+), and desktop (1024px+)
**Project Type**: Web application frontend (Next.js App Router with TypeScript)
**Performance Goals**: <3s initial page load, <2s API requests, <100ms optimistic UI updates, <500ms loading state visibility threshold
**Constraints**: JWT in localStorage (acceptable for MVP), no backend modifications allowed, CORS must be configured on backend, stateless authentication only
**Scale/Scope**: 3 pages (signup, login, dashboard), 5 reusable components, 2 custom hooks, 3 utility modules, supports unlimited users with multi-tenant isolation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Spec-Driven Development (SDD) Compliance**: Following /sp.specify → /sp.plan → /sp.tasks → /sp.implement workflow
- ✅ **Layered Architecture Separation**: Frontend layer communicates with backend only via REST API, no direct database access
- ✅ **Multi-Tenant Data Isolation**: JWT token contains user_id, all API requests filtered by user_id on backend, frontend never displays other users' data
- ✅ **Agent-Based Development**: Using frontend-agent for all Next.js/React/TypeScript work, auth-agent for JWT validation
- ✅ **Free-Tier Friendly Infrastructure**: Next.js runs locally, no paid services required for development
- ✅ **AI-Ready Architecture**: Clean component structure, well-typed interfaces, RESTful API integration enables future AI features

## Project Structure

### Documentation (this feature)

```text
specs/003-nextjs-frontend-integration/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── api-integration.md  # Frontend-backend API integration guide
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── .env.local           # Environment variables (NEXT_PUBLIC_API_URL)
├── package.json         # Dependencies and scripts
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with global styles
│   │   ├── page.tsx             # Landing/home page
│   │   ├── login/
│   │   │   └── page.tsx         # Login page (Client Component)
│   │   ├── signup/
│   │   │   └── page.tsx         # Signup page (Client Component)
│   │   └── dashboard/
│   │       ├── layout.tsx       # Dashboard layout with Navbar
│   │       └── page.tsx         # Dashboard page with todo list (Client Component)
│   ├── components/
│   │   ├── Navbar.tsx           # Navigation bar with auth toggle (Client Component)
│   │   ├── TodoForm.tsx         # Create todo form (Client Component)
│   │   ├── TodoList.tsx         # Todo list container (Client Component)
│   │   ├── TodoItem.tsx         # Individual todo item with actions (Client Component)
│   │   └── LoadingSkeleton.tsx  # Loading skeleton component
│   ├── hooks/
│   │   ├── useAuth.ts           # Authentication hook (login, signup, logout)
│   │   └── useTodos.ts          # Todo CRUD hook (fetch, create, update, delete)
│   ├── lib/
│   │   ├── api.ts               # Axios instance with interceptors
│   │   ├── auth.ts              # Auth helper functions (getToken, setToken, clearToken)
│   │   └── types.ts             # TypeScript interfaces (User, Todo, AuthResponse)
│   └── middleware.ts            # Next.js middleware for route protection
└── public/                      # Static assets
```

**Structure Decision**: Web application frontend using Next.js 16 App Router architecture. All pages are in `src/app/` following App Router conventions. Reusable components in `src/components/`, custom hooks in `src/hooks/`, and utilities in `src/lib/`. Middleware at root level for route protection. This structure follows Next.js best practices and enables clear separation of concerns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitution principles are satisfied.

## Architecture Decisions

### Decision 1: Next.js 16 App Router

**Rationale**: Next.js 16 App Router provides Server Components by default for better performance, built-in routing with file-system based structure, native middleware support for route protection, and automatic code splitting. These features align perfectly with the requirements for protected routes, responsive UI, and optimal performance.

**Alternatives Considered**:
- Next.js Pages Router: Older architecture, lacks Server Components, requires more boilerplate for route protection
- Create React App: No built-in routing, SSR, or middleware support, would require additional libraries
- Vite + React Router: More manual configuration, no Server Components, less optimized for production

**Trade-offs**: App Router is newer and has a learning curve, but provides significant performance and developer experience benefits. Server Components reduce client-side JavaScript bundle size.

### Decision 2: React Hooks for State Management

**Rationale**: React Hooks (useState, useEffect) with custom hooks (useAuth, useTodos) provide sufficient state management for this application's scope. Custom hooks enable reusability and separation of concerns without the complexity of Redux or Zustand.

**Alternatives Considered**:
- Redux Toolkit: Too heavyweight for this scope, adds unnecessary complexity and boilerplate
- Zustand: Simpler than Redux but still overkill for 3 pages and basic CRUD operations
- Context API: Could work but custom hooks are more composable and testable

**Trade-offs**: Hooks are simpler but don't provide global state management. For this MVP, component-level state with custom hooks is sufficient. Can migrate to Zustand later if needed.

### Decision 3: Axios with Interceptors

**Rationale**: Axios provides a clean API for HTTP requests with built-in interceptor support for automatic JWT header injection and global error handling. Interceptors enable centralized authentication logic and 401 error handling (auto-logout and redirect).

**Alternatives Considered**:
- Fetch API: Native but lacks interceptors, would require manual wrapper functions for JWT injection
- SWR or React Query: Excellent for data fetching but adds complexity for simple CRUD operations
- tRPC: Requires backend changes (TypeScript), violates constraint of no backend modifications

**Trade-offs**: Axios adds ~13KB to bundle size but provides significant developer experience benefits. Interceptors eliminate repetitive code for auth headers.

### Decision 4: JWT in localStorage

**Rationale**: localStorage provides simple, persistent token storage that survives page refreshes and browser sessions. For MVP, this is acceptable and enables quick development. Tokens are automatically included in all API requests via Axios interceptors.

**Alternatives Considered**:
- httpOnly cookies: More secure but requires backend changes for cookie handling
- sessionStorage: Tokens lost on tab close, poor user experience
- Memory only: Tokens lost on page refresh, requires re-login frequently

**Trade-offs**: localStorage is vulnerable to XSS attacks. This is documented as a known limitation for MVP. For production, should migrate to httpOnly cookies with refresh token rotation.

### Decision 5: Tailwind CSS

**Rationale**: Tailwind CSS provides utility-first styling with mobile-first responsive design built-in. Enables rapid UI development with consistent spacing, colors, and breakpoints. No custom CSS files needed, reducing maintenance burden.

**Alternatives Considered**:
- CSS Modules: More verbose, requires separate CSS files, harder to maintain consistency
- Styled Components: Runtime overhead, larger bundle size, not optimized for Server Components
- Plain CSS: Too much boilerplate, difficult to maintain consistency across components

**Trade-offs**: Tailwind adds ~50KB to bundle (after purging unused styles) but eliminates need for custom CSS. Utility classes can be verbose in JSX but are highly maintainable.

### Decision 6: Client Components for Interactivity

**Rationale**: Next.js 16 App Router uses Server Components by default for better performance. Client Components (marked with 'use client') are only used for interactive elements: forms, buttons, hooks, and state management. This minimizes client-side JavaScript while maintaining interactivity.

**Alternatives Considered**:
- All Client Components: Simpler but loses performance benefits of Server Components
- All Server Components: Impossible for interactive forms and state management
- Hybrid with Server Actions: Could work but adds complexity for simple CRUD operations

**Trade-offs**: Requires careful component boundary decisions. Forms and pages with state must be Client Components. Static content can be Server Components.

## Implementation Phases

### Phase C1: Project Setup & API Layer

**Goal**: Initialize Next.js project and create foundational API communication layer

**Tasks**:
1. Create Next.js 16 project with TypeScript and Tailwind CSS: `npx create-next-app@latest frontend --typescript --tailwind --app --src-dir`
2. Install dependencies: `npm install axios react-hot-toast`
3. Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8001`
4. Create `src/lib/api.ts` with Axios instance configured with base URL and interceptors
5. Create `src/lib/types.ts` with TypeScript interfaces for User, Todo, AuthResponse, TodoResponse
6. Configure Axios request interceptor to inject JWT token from localStorage
7. Configure Axios response interceptor to handle 401 errors (clear token, redirect to /login)

**Files Created**:
- `frontend/.env.local`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/types.ts`

**Acceptance Criteria**:
- Next.js project runs on http://localhost:3000
- Axios instance successfully makes requests to backend
- Request interceptor adds Authorization header when token exists
- Response interceptor redirects to /login on 401 errors

---

### Phase C2: Authentication Context & Hooks

**Goal**: Create reusable authentication logic with custom hooks

**Tasks**:
1. Create `src/lib/auth.ts` with helper functions: `getToken()`, `setToken(token)`, `clearToken()`
2. Create `src/hooks/useAuth.ts` with signup, login, and logout functions
3. Implement signup function: POST /auth/signup, store token, redirect to /dashboard
4. Implement login function: POST /auth/login, store token, redirect to /dashboard
5. Implement logout function: clear token from localStorage, redirect to /login
6. Add error handling with toast notifications for all auth operations

**Files Created**:
- `frontend/src/lib/auth.ts`
- `frontend/src/hooks/useAuth.ts`

**Acceptance Criteria**:
- useAuth hook provides signup, login, logout functions
- Tokens are correctly stored in and retrieved from localStorage
- Error messages display via toast notifications
- Successful auth operations redirect to appropriate pages

---

### Phase C3: Auth Pages

**Goal**: Build signup and login pages with form validation

**Tasks**:
1. Create `src/app/signup/page.tsx` as Client Component with email and password inputs
2. Create `src/app/login/page.tsx` as Client Component with email and password inputs
3. Add form validation: email format, password minimum 8 characters
4. Integrate useAuth hook for signup and login functionality
5. Display inline validation errors before submission
6. Show loading state during API calls (disable submit button)
7. Display success/error toast notifications
8. Auto-redirect to /dashboard on successful authentication

**Files Created**:
- `frontend/src/app/signup/page.tsx`
- `frontend/src/app/login/page.tsx`

**Acceptance Criteria**:
- Signup page validates email format and password length
- Login page accepts credentials and calls backend API
- Form validation prevents invalid submissions
- Loading states visible during API calls
- Toast notifications show success/error messages
- Successful auth redirects to /dashboard

---

### Phase C4: Route Protection

**Goal**: Implement middleware to protect dashboard route

**Tasks**:
1. Create `src/middleware.ts` for Next.js middleware
2. Check for JWT token in localStorage (via cookie or header)
3. Protect /dashboard route: redirect to /login if no token
4. Allow unauthenticated access to /login and /signup
5. Redirect authenticated users from /login to /dashboard

**Files Created**:
- `frontend/src/middleware.ts`

**Acceptance Criteria**:
- Unauthenticated users cannot access /dashboard
- Authenticated users are redirected from /login to /dashboard
- Middleware runs on every route change
- Token validation happens before page render

---

### Phase C5: Dashboard Layout & Navigation

**Goal**: Create dashboard layout with navigation bar

**Tasks**:
1. Create `src/components/Navbar.tsx` as Client Component
2. Display Login/Logout button based on authentication state
3. Show user email in navbar when authenticated
4. Implement logout functionality (clear token, redirect to /login)
5. Create `src/app/dashboard/layout.tsx` with Navbar
6. Style navbar with Tailwind CSS (responsive design)

**Files Created**:
- `frontend/src/components/Navbar.tsx`
- `frontend/src/app/dashboard/layout.tsx`

**Acceptance Criteria**:
- Navbar displays Login button when not authenticated
- Navbar displays Logout button and user email when authenticated
- Logout clears token and redirects to /login
- Navbar is responsive on mobile and desktop
- Dashboard layout includes Navbar on all dashboard pages

---

### Phase C6: Todo CRUD Components

**Goal**: Build todo management components with full CRUD operations

**Tasks**:
1. Create `src/hooks/useTodos.ts` with fetch, create, update, delete functions
2. Implement fetchTodos: GET /todos, filtered by JWT user_id
3. Implement createTodo: POST /todos with title and description
4. Implement updateTodo: PUT /todos/{id} with updated data
5. Implement deleteTodo: DELETE /todos/{id}
6. Create `src/components/TodoForm.tsx` for creating new todos
7. Create `src/components/TodoList.tsx` to display todo list
8. Create `src/components/TodoItem.tsx` with edit and delete buttons
9. Create `src/app/dashboard/page.tsx` integrating all todo components
10. Add empty state message when no todos exist
11. Implement real-time UI updates after mutations

**Files Created**:
- `frontend/src/hooks/useTodos.ts`
- `frontend/src/components/TodoForm.tsx`
- `frontend/src/components/TodoList.tsx`
- `frontend/src/components/TodoItem.tsx`
- `frontend/src/app/dashboard/page.tsx`

**Acceptance Criteria**:
- Dashboard displays list of user's todos
- Create form adds new todos to the list
- Edit functionality updates todo in place
- Delete removes todo from list
- Empty state displays when no todos exist
- All operations persist after page refresh

---

### Phase C7: Completion Toggle

**Goal**: Add completion toggle with optimistic UI updates

**Tasks**:
1. Add checkbox to TodoItem component
2. Implement toggleComplete function: PATCH /todos/{id}/complete
3. Add visual feedback: strikethrough text or color change for completed todos
4. Implement optimistic UI update (update UI before API response)
5. Revert UI if API call fails

**Files Modified**:
- `frontend/src/components/TodoItem.tsx`
- `frontend/src/hooks/useTodos.ts`

**Acceptance Criteria**:
- Checkbox toggles completion status
- Visual feedback shows completed state (strikethrough or color)
- UI updates immediately (optimistic update)
- Completion state persists after page refresh
- UI reverts if API call fails

---

### Phase C8: UI/UX Polish

**Goal**: Add loading states, error handling, and responsive design

**Tasks**:
1. Create `src/components/LoadingSkeleton.tsx` for loading states
2. Add loading skeletons to dashboard while fetching todos
3. Implement toast notifications for all success/error messages
4. Add form validation error messages (inline)
5. Test responsive design on mobile (320px), tablet (768px), desktop (1024px+)
6. Ensure touch targets are at least 44x44px for mobile
7. Verify color contrast meets WCAG AA standards
8. Add ARIA labels for accessibility

**Files Created**:
- `frontend/src/components/LoadingSkeleton.tsx`

**Files Modified**:
- All components (add loading states, error handling, responsive styles)

**Acceptance Criteria**:
- Loading skeletons display during async operations
- Toast notifications show for all user actions
- Forms display inline validation errors
- Layout is responsive on all screen sizes
- Touch targets are appropriately sized for mobile
- Color contrast is accessible
- ARIA labels improve screen reader support

---

### Phase C9: Integration Testing

**Goal**: Verify end-to-end functionality and multi-tenant isolation

**Test Scenarios**:

1. **Auth Flow Test**:
   - Signup with valid credentials → Success + redirect to dashboard
   - Signup with duplicate email → Error toast "Email already registered"
   - Login with correct credentials → Success + redirect to dashboard
   - Login with wrong password → Error toast "Invalid email or password"
   - Access /dashboard without token → Redirect to /login
   - Logout → Token cleared + redirect to /login

2. **Todo CRUD Test**:
   - Create todo with title only → Appears in list
   - Create todo with title and description → Both fields displayed
   - Edit todo → Changes persist after page refresh
   - Delete todo → Removed from list permanently
   - Toggle complete → Status changes with visual feedback

3. **Multi-Tenant Test**:
   - User A creates 5 todos
   - User B logs in → Sees empty list (not User A's todos)
   - User A's todos not visible in User B's session
   - User B creates todo → Only visible to User B

4. **Persistence Test**:
   - Login → Create todo → Refresh page → Todo still visible
   - Logout → Login again → Todos persist from previous session

5. **Responsive Design Test**:
   - Test on mobile (320px width) → Layout adapts, forms usable
   - Test on tablet (768px width) → Layout utilizes space effectively
   - Test on desktop (1024px+ width) → Optimal layout and spacing

**Acceptance Criteria**:
- All test scenarios pass without errors
- Multi-tenant isolation verified (User A cannot see User B's data)
- Authentication flow works end-to-end
- CRUD operations functional with backend API
- Responsive design works on all screen sizes
- Error handling displays user-friendly messages
- Loading states prevent UI confusion

---

## Dependencies

### External Dependencies

- **FastAPI Backend (Sprint B)**: Frontend depends on completed backend API from 002-fastapi-backend-auth running on http://localhost:8001
- **CORS Configuration**: Backend must allow requests from http://localhost:3000 (verify CORS_ORIGINS in backend/.env)
- **Database**: Backend must have access to Neon PostgreSQL with user and todo tables

### Technical Dependencies

- Next.js 16 (App Router)
- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- Axios (HTTP client)
- React Hot Toast (notifications)
- Node.js 18+ runtime

### Prerequisite Features

- Sprint A (001-sqlmodel-database): Database models and connection
- Sprint B (002-fastapi-backend-auth): Complete backend API with authentication and todo CRUD endpoints

## Non-Functional Requirements

### Performance

- Initial page load: <3 seconds on standard broadband
- API requests: <2 seconds under normal conditions
- Optimistic UI updates: <100ms for immediate feedback
- Loading states: Visible for operations >500ms

### Usability

- Forms have clear labels and placeholder text
- Error messages are specific and actionable
- Touch targets: Minimum 44x44px for mobile
- Color contrast: WCAG AA standards
- Responsive design: 320px to 1920px width

### Security

- JWT tokens in localStorage (documented limitation for MVP)
- No sensitive data in console logs (production builds)
- Form inputs sanitized to prevent XSS
- HTTPS in production (HTTP acceptable for local development)

### Maintainability

- TypeScript types for all API responses and props
- Modular, reusable components
- Next.js and React best practices
- Environment variables for configuration

## Risks & Mitigations

### Risk 1: JWT Token Security in localStorage

**Risk**: localStorage is vulnerable to XSS attacks. Malicious JavaScript can steal tokens.

**Mitigation**: Document as known limitation for MVP. For production, migrate to httpOnly cookies with refresh token rotation. Implement Content Security Policy (CSP) headers.

### Risk 2: Backend API Unavailability

**Risk**: If backend is down, frontend becomes unusable.

**Mitigation**: Implement comprehensive error handling with user-friendly messages. Add health check endpoint polling. Consider offline mode with service workers in future iterations.

### Risk 3: CORS Configuration Issues

**Risk**: Incorrect CORS settings block all API requests.

**Mitigation**: Verify CORS_ORIGINS includes http://localhost:3000 in backend .env before starting frontend development. Test CORS with simple fetch request first.

### Risk 4: Token Expiration During Active Session

**Risk**: JWT expires while user is actively using the app, causing unexpected logout.

**Mitigation**: Implement automatic logout with clear messaging on 401 errors. Consider adding token refresh mechanism or extending token expiration to 30 days for better UX.

### Risk 5: Browser Compatibility

**Risk**: Older browsers may not support modern JavaScript features or localStorage.

**Mitigation**: Target modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions). Display unsupported browser message for older versions. Use Next.js built-in polyfills for broader compatibility.
