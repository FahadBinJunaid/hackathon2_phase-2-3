# Research: Phase 2 – Sprint C: Frontend UI & Backend Integration

**Feature**: 003-nextjs-frontend-integration
**Date**: 2026-02-07
**Phase**: Phase 0 - Research & Technical Decisions

## Overview

This document captures the research and technical decisions made for building the Next.js frontend that integrates with the FastAPI backend. All decisions are based on the requirements from the feature specification and align with the project constitution.

## Technology Stack Research

### Next.js 16 App Router

**Decision**: Use Next.js 16 with App Router architecture

**Research Findings**:
- **Server Components**: Default rendering strategy reduces client-side JavaScript bundle size by 30-50%
- **Built-in Routing**: File-system based routing eliminates need for react-router-dom
- **Middleware Support**: Native middleware for route protection without additional libraries
- **Performance**: Automatic code splitting, image optimization, and font optimization
- **Developer Experience**: Hot reload, TypeScript support, and excellent documentation

**Alternatives Evaluated**:
1. **Next.js Pages Router**: Older architecture, lacks Server Components, requires more boilerplate
2. **Create React App**: No SSR, no built-in routing, deprecated by React team
3. **Vite + React Router**: More manual configuration, no Server Components, less optimized

**Rationale**: App Router provides the best balance of performance, developer experience, and built-in features for this project. Server Components align with the constitution's performance goals.

**References**:
- Next.js 16 Documentation: https://nextjs.org/docs
- App Router Migration Guide: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration

---

### State Management: React Hooks

**Decision**: Use React Hooks (useState, useEffect) with custom hooks (useAuth, useTodos)

**Research Findings**:
- **Simplicity**: No additional libraries needed, reduces bundle size
- **Custom Hooks**: Enable reusability and separation of concerns
- **Composability**: Hooks can be combined and nested for complex logic
- **Performance**: No global state overhead, component-level optimization
- **Learning Curve**: Standard React patterns, no new concepts to learn

**Alternatives Evaluated**:
1. **Redux Toolkit**: 45KB bundle size, complex setup, overkill for 3 pages
2. **Zustand**: 3KB bundle size, simpler than Redux but still unnecessary
3. **Context API**: Could work but custom hooks are more testable and composable

**Rationale**: For this MVP with 3 pages and basic CRUD operations, React Hooks provide sufficient state management without the complexity of global state libraries. Custom hooks (useAuth, useTodos) encapsulate business logic and can be easily tested.

**Migration Path**: If the application grows beyond 10 pages or requires complex state sharing, can migrate to Zustand with minimal refactoring.

**References**:
- React Hooks Documentation: https://react.dev/reference/react
- Custom Hooks Best Practices: https://react.dev/learn/reusing-logic-with-custom-hooks

---

### API Communication: Axios

**Decision**: Use Axios for HTTP requests with interceptors

**Research Findings**:
- **Interceptors**: Built-in support for request/response interceptors
- **Automatic Transforms**: JSON parsing, error handling, timeout management
- **Browser Support**: Works in all modern browsers and Node.js
- **Bundle Size**: ~13KB minified + gzipped
- **Developer Experience**: Clean API, excellent TypeScript support

**Alternatives Evaluated**:
1. **Fetch API**: Native but lacks interceptors, requires manual wrapper functions
2. **SWR**: Excellent for data fetching but adds complexity (7KB + React dependency)
3. **React Query**: Powerful but overkill for simple CRUD (40KB bundle size)

**Rationale**: Axios interceptors enable centralized JWT header injection and 401 error handling without repetitive code. The 13KB bundle size is acceptable for the developer experience benefits.

**Implementation Pattern**:
```typescript
// Request interceptor: Add JWT token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**References**:
- Axios Documentation: https://axios-http.com/docs/intro
- Interceptors Guide: https://axios-http.com/docs/interceptors

---

### Authentication: JWT in localStorage

**Decision**: Store JWT tokens in localStorage for MVP

**Research Findings**:
- **Persistence**: Survives page refreshes and browser sessions
- **Simplicity**: No backend changes required, easy to implement
- **Accessibility**: Can be accessed from any JavaScript context
- **Security Risk**: Vulnerable to XSS attacks (documented limitation)

**Alternatives Evaluated**:
1. **httpOnly Cookies**: More secure but requires backend changes (violates constraint)
2. **sessionStorage**: Tokens lost on tab close, poor UX
3. **Memory Only**: Tokens lost on page refresh, requires frequent re-login

**Rationale**: For MVP, localStorage provides the simplest implementation that meets functional requirements. The XSS vulnerability is documented as a known limitation. For production, should migrate to httpOnly cookies with refresh token rotation.

**Security Considerations**:
- Implement Content Security Policy (CSP) headers to mitigate XSS
- Sanitize all user inputs to prevent script injection
- Use HTTPS in production to prevent token interception
- Set token expiration to 7 days (backend configured)

**Migration Path for Production**:
1. Backend: Add cookie-based authentication endpoints
2. Backend: Implement refresh token rotation
3. Frontend: Remove localStorage, use httpOnly cookies
4. Frontend: Add refresh token logic before token expiration

**References**:
- OWASP JWT Security: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- localStorage vs Cookies: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

### Styling: Tailwind CSS

**Decision**: Use Tailwind CSS for utility-first styling

**Research Findings**:
- **Bundle Size**: ~50KB after purging unused styles (production)
- **Mobile-First**: Built-in responsive design utilities
- **Consistency**: Predefined spacing, colors, and breakpoints
- **Developer Experience**: No context switching between HTML and CSS
- **Performance**: No runtime overhead, all styles compiled at build time

**Alternatives Evaluated**:
1. **CSS Modules**: More verbose, requires separate CSS files, harder to maintain
2. **Styled Components**: 16KB runtime overhead, not optimized for Server Components
3. **Plain CSS**: Too much boilerplate, difficult to maintain consistency

**Rationale**: Tailwind CSS enables rapid UI development with consistent design system. Mobile-first approach aligns with responsive design requirements. Utility classes reduce CSS file size and eliminate unused styles.

**Configuration**:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
      },
    },
  },
  plugins: [],
};
```

**References**:
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- Next.js + Tailwind Setup: https://tailwindcss.com/docs/guides/nextjs

---

### Component Strategy: Server vs Client Components

**Decision**: Use Server Components by default, Client Components only for interactivity

**Research Findings**:
- **Server Components**: Zero JavaScript sent to client, faster initial load
- **Client Components**: Required for useState, useEffect, event handlers
- **Boundary**: Mark with 'use client' directive at top of file
- **Performance**: Server Components reduce bundle size by 30-50%

**Component Classification**:

**Server Components** (no 'use client'):
- Layout components (app/layout.tsx, app/dashboard/layout.tsx)
- Static pages (app/page.tsx - landing page)
- LoadingSkeleton (no state or interactivity)

**Client Components** ('use client' required):
- Auth pages (app/login/page.tsx, app/signup/page.tsx) - forms with state
- Dashboard page (app/dashboard/page.tsx) - uses hooks
- Navbar (components/Navbar.tsx) - logout button, state
- TodoForm (components/TodoForm.tsx) - form with state
- TodoList (components/TodoList.tsx) - renders Client Components
- TodoItem (components/TodoItem.tsx) - edit/delete buttons, state

**Rationale**: Maximizing Server Components reduces client-side JavaScript and improves performance. Only components with interactivity (forms, buttons, state) need to be Client Components.

**References**:
- Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Client Components: https://nextjs.org/docs/app/building-your-application/rendering/client-components

---

### Route Protection: Next.js Middleware

**Decision**: Use Next.js middleware for route protection

**Research Findings**:
- **Execution**: Runs before page render, on Edge runtime
- **Performance**: Faster than client-side redirects
- **Security**: Prevents unauthorized page access before rendering
- **Limitations**: Cannot access localStorage directly (runs on server)

**Implementation Strategy**:
Since middleware runs on the server and cannot access localStorage, we'll use a hybrid approach:
1. Middleware checks for token in cookies (if available)
2. Client-side check in protected pages as fallback
3. Redirect to /login if no token found

**Alternative Approach** (chosen for MVP):
- Skip middleware for localStorage-based auth
- Use client-side protection in dashboard page
- Check for token on component mount, redirect if missing

**Rationale**: Since we're using localStorage (client-side only), middleware cannot access the token. Client-side protection is simpler for MVP. For production with httpOnly cookies, can add proper middleware.

**References**:
- Next.js Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
- Route Protection Patterns: https://nextjs.org/docs/app/building-your-application/authentication

---

### Toast Notifications: React Hot Toast

**Decision**: Use react-hot-toast for success/error notifications

**Research Findings**:
- **Bundle Size**: 3.5KB minified + gzipped
- **Features**: Promise-based API, customizable, accessible
- **Performance**: Lightweight, no dependencies
- **Developer Experience**: Simple API, TypeScript support

**Alternatives Evaluated**:
1. **React Toastify**: 6KB, more features but heavier
2. **Sonner**: 4KB, newer but less mature
3. **Custom Implementation**: Would require 5-10KB of custom code

**Rationale**: React Hot Toast provides the best balance of features, bundle size, and developer experience. Promise-based API works well with async operations.

**Usage Pattern**:
```typescript
import toast from 'react-hot-toast';

// Success
toast.success('Todo created successfully');

// Error
toast.error('Failed to create todo');

// Loading
const promise = createTodo(data);
toast.promise(promise, {
  loading: 'Creating todo...',
  success: 'Todo created!',
  error: 'Failed to create todo',
});
```

**References**:
- React Hot Toast: https://react-hot-toast.com/
- Toast Best Practices: https://react-hot-toast.com/docs/toast

---

## Integration Patterns

### Frontend-Backend Communication

**Pattern**: RESTful API with JWT authentication

**Request Flow**:
1. User performs action (signup, login, create todo)
2. Frontend calls API via Axios with JWT token in Authorization header
3. Backend validates JWT, processes request, returns response
4. Frontend updates UI based on response

**Error Handling**:
- 401 Unauthorized: Clear token, redirect to /login
- 409 Conflict: Display error toast (e.g., "Email already registered")
- 422 Validation Error: Display inline form errors
- 500 Server Error: Display generic error toast

**Optimistic Updates**:
- Completion toggle: Update UI immediately, revert if API fails
- Create todo: Add to list immediately, remove if API fails
- Delete todo: Remove from list immediately, restore if API fails

---

### Multi-Tenant Isolation

**Implementation**: JWT token contains user_id, backend filters all queries

**Frontend Responsibilities**:
- Store JWT token securely (localStorage for MVP)
- Include token in all API requests (via Axios interceptor)
- Never display data from other users (backend enforces this)

**Backend Responsibilities** (already implemented in Sprint B):
- Extract user_id from JWT token
- Filter all GET /todos queries by user_id
- Verify ownership on PUT/DELETE/PATCH operations
- Return 404 for unauthorized access (not 403, for security)

**Testing Strategy**:
1. Create User A, add 5 todos
2. Create User B, verify empty list
3. User B creates todo, verify only B's todo visible
4. User A logs back in, verify only A's 5 todos visible

---

## Performance Optimization

### Bundle Size Optimization

**Strategies**:
- Use Server Components to reduce client-side JavaScript
- Import only needed Axios features (not entire library)
- Purge unused Tailwind CSS classes in production
- Use Next.js automatic code splitting
- Lazy load components not needed on initial render

**Expected Bundle Sizes**:
- Next.js framework: ~80KB (gzipped)
- React: ~40KB (gzipped)
- Axios: ~13KB (gzipped)
- React Hot Toast: ~3.5KB (gzipped)
- Tailwind CSS: ~50KB (gzipped, after purging)
- **Total**: ~186KB (gzipped) for initial load

**Target**: <200KB gzipped for initial page load

---

### Loading States

**Strategy**: Show loading indicators for operations >500ms

**Implementation**:
- Skeleton screens for initial data fetch
- Spinner for form submissions
- Disabled buttons during API calls
- Toast notifications for long-running operations

**User Experience**:
- Immediate feedback for all user actions
- No blank screens during loading
- Clear indication of progress
- Prevent duplicate submissions

---

## Security Considerations

### XSS Prevention

**Strategies**:
- React automatically escapes JSX content
- Sanitize user inputs before display
- Use Content Security Policy (CSP) headers
- Avoid dangerouslySetInnerHTML

### CSRF Protection

**Not Required**: JWT in Authorization header (not cookies) prevents CSRF attacks

### Input Validation

**Client-Side**:
- Email format validation
- Password length validation (min 8 characters)
- Title max length (255 characters)
- Description max length (1000 characters)

**Server-Side** (already implemented in Sprint B):
- Pydantic validation on all endpoints
- Email format validation
- Password hashing with bcrypt
- SQL injection prevention via SQLModel ORM

---

## Testing Strategy

### Manual Testing

**Auth Flow**:
1. Signup with valid credentials → Success
2. Signup with duplicate email → Error
3. Login with correct credentials → Success
4. Login with wrong password → Error
5. Access /dashboard without token → Redirect to /login
6. Logout → Token cleared, redirect to /login

**Todo CRUD**:
1. Create todo → Appears in list
2. Edit todo → Changes persist
3. Delete todo → Removed from list
4. Toggle complete → Status changes

**Multi-Tenant**:
1. User A creates todos
2. User B logs in → Sees only B's todos
3. Verify isolation

**Responsive Design**:
1. Test on mobile (320px)
2. Test on tablet (768px)
3. Test on desktop (1024px+)

### Browser Testing

**Target Browsers**:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

---

## Conclusion

All technical decisions have been researched and documented. The chosen stack (Next.js 16, React Hooks, Axios, Tailwind CSS) aligns with the project constitution and provides the best balance of performance, developer experience, and maintainability for this MVP.

**Key Takeaways**:
- Server Components reduce bundle size by 30-50%
- React Hooks sufficient for state management (no Redux needed)
- Axios interceptors enable centralized auth logic
- localStorage acceptable for MVP (migrate to httpOnly cookies for production)
- Tailwind CSS enables rapid, consistent UI development

**Next Steps**:
- Phase 1: Create data-model.md, contracts/, and quickstart.md
- Phase 2: Generate tasks.md with detailed implementation tasks
- Phase 3: Execute implementation with frontend-agent
