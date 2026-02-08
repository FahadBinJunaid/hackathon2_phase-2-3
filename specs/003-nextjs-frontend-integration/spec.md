# Feature Specification: Next.js Frontend UI & Backend Integration

**Feature Branch**: `003-nextjs-frontend-integration`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "Phase 2 – Sprint C: Frontend UI & Backend Integration - Build a responsive, modern Todo application UI using Next.js App Router that integrates with the FastAPI backend"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Authentication Flow (Priority: P1) 🎯 MVP

A new user visits the application and needs to create an account to access their personal todo list. They provide their email and password, receive a JWT token, and are automatically logged into the dashboard. Returning users can log in with their credentials and access their existing todos.

**Why this priority**: Authentication is the foundation for all other features. Without it, users cannot access the application or maintain data isolation between different users. This is the minimum viable product that enables all subsequent functionality.

**Independent Test**: Can be fully tested by visiting the signup page, creating an account with valid credentials, verifying automatic redirect to dashboard with JWT token stored in localStorage, then logging out and logging back in with the same credentials.

**Acceptance Scenarios**:

1. **Given** a new user visits /signup, **When** they enter a valid email and password (min 8 characters) and submit, **Then** they receive a JWT token, it's stored in localStorage, and they're redirected to /dashboard
2. **Given** a user tries to signup with an existing email, **When** they submit the form, **Then** they see an error message "Email already registered"
3. **Given** a user tries to signup with a password less than 8 characters, **When** they submit the form, **Then** they see a validation error "Password must be at least 8 characters"
4. **Given** a registered user visits /login, **When** they enter correct credentials and submit, **Then** they receive a JWT token, it's stored in localStorage, and they're redirected to /dashboard
5. **Given** a user enters wrong credentials on /login, **When** they submit the form, **Then** they see an error message "Invalid email or password"
6. **Given** an authenticated user is on /dashboard, **When** they click logout, **Then** their JWT token is removed from localStorage and they're redirected to /login
7. **Given** an unauthenticated user tries to access /dashboard, **When** the page loads, **Then** they're automatically redirected to /login

---

### User Story 2 - Todo Dashboard with CRUD Operations (Priority: P2)

An authenticated user accesses their personal dashboard to manage their todo list. They can view all their existing todos, create new tasks with titles and descriptions, edit existing tasks, mark tasks as complete/incomplete, and delete tasks they no longer need. All operations are isolated to their account - they never see other users' todos.

**Why this priority**: This is the core functionality of the application. Once users can authenticate, they need to actually manage their todos. This delivers the primary value proposition of the application.

**Independent Test**: Can be fully tested by logging in as User A, creating multiple todos, verifying they appear in the list, editing a todo and confirming changes persist, toggling completion status, deleting a todo, then logging in as User B and verifying they see an empty list (multi-tenant isolation).

**Acceptance Scenarios**:

1. **Given** an authenticated user is on /dashboard, **When** the page loads, **Then** they see a list of only their own todos (filtered by their JWT user_id)
2. **Given** a user has no todos, **When** they view /dashboard, **Then** they see an empty state message "No todos yet. Create your first task!"
3. **Given** a user is on /dashboard, **When** they enter a title in the create form and submit, **Then** a new todo is created with that title, appears in the list immediately, and persists after page refresh
4. **Given** a user creates a todo with both title and description, **When** they submit the form, **Then** both fields are saved and displayed in the todo list
5. **Given** a user clicks edit on a todo, **When** they modify the title or description and save, **Then** the changes are reflected immediately in the list and persist after page refresh
6. **Given** a user clicks the checkbox on a todo, **When** the toggle completes, **Then** the todo's completion status changes, visual feedback is shown (strikethrough or color change), and the state persists after page refresh
7. **Given** a user clicks delete on a todo, **When** they confirm the action, **Then** the todo is removed from the list immediately and no longer appears after page refresh
8. **Given** User A has created 5 todos, **When** User B logs in and views their dashboard, **Then** User B sees an empty list (multi-tenant isolation verified)

---

### User Story 3 - Responsive UI with Loading States and Error Handling (Priority: P3)

Users interact with the application on various devices (desktop, tablet, mobile) and expect a smooth, responsive experience. When actions are in progress, they see loading indicators. When errors occur, they receive clear, user-friendly messages via toast notifications. The interface adapts seamlessly to different screen sizes.

**Why this priority**: While authentication and CRUD operations are functional requirements, polish and user experience improvements make the application production-ready and user-friendly. This enhances usability but isn't required for core functionality.

**Independent Test**: Can be fully tested by accessing the application on mobile and desktop devices, verifying layout adapts correctly, triggering various actions and observing loading states, simulating network errors and verifying toast notifications appear with appropriate messages.

**Acceptance Scenarios**:

1. **Given** a user submits a form (signup, login, create todo), **When** the API request is in progress, **Then** they see a loading indicator (spinner or skeleton screen) and the submit button is disabled
2. **Given** a user performs an action that succeeds, **When** the API responds, **Then** they see a success toast notification with a relevant message (e.g., "Todo created successfully")
3. **Given** a user performs an action that fails, **When** the API returns an error, **Then** they see an error toast notification with a user-friendly message (e.g., "Failed to create todo. Please try again.")
4. **Given** a user's JWT token expires, **When** they make an API request, **Then** they receive a 401 error, are automatically logged out, and redirected to /login with a message "Session expired. Please log in again."
5. **Given** a user accesses the application on a mobile device, **When** they view any page, **Then** the layout is responsive, text is readable, buttons are tappable, and forms are usable
6. **Given** a user accesses the application on a desktop, **When** they view the dashboard, **Then** todos are displayed in a grid or list layout that utilizes the available screen space effectively
7. **Given** the backend API is unreachable, **When** a user tries to perform any action, **Then** they see an error message "Unable to connect to server. Please check your connection."

---

### Edge Cases

- What happens when JWT token expires during an active session? → User is automatically logged out and redirected to /login with a "Session expired" message
- How does the system handle network errors or backend downtime? → Display user-friendly error toast notifications and maintain UI state (don't lose form data)
- What if a user tries to access a todo that was deleted by another session? → Return 404 error and remove the todo from the UI with a message "This todo no longer exists"
- What happens when a user submits a form with invalid data? → Show inline validation errors before submission, prevent API call until valid
- How does the system handle concurrent edits (user edits same todo in two browser tabs)? → Last write wins; no conflict resolution needed for MVP
- What if localStorage is disabled or unavailable? → Show error message "This application requires browser storage to function. Please enable cookies and local storage."
- What happens when a user refreshes the page during an API call? → API call is cancelled, page reloads with fresh data from server
- How does the system handle very long todo titles or descriptions? → Enforce max length validation (title: 255 chars, description: 1000 chars) on frontend before submission

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST initialize a Next.js 16 project using App Router architecture in the frontend/ directory
- **FR-002**: System MUST use TypeScript for all components and utilities to ensure type safety
- **FR-003**: System MUST configure Tailwind CSS for styling with mobile-first responsive design
- **FR-004**: System MUST create an Axios API client instance configured with base URL http://localhost:8001
- **FR-005**: System MUST implement request interceptors that automatically attach JWT token from localStorage to all API requests in the Authorization header
- **FR-006**: System MUST implement response interceptors that detect 401 errors, clear localStorage, and redirect to /login
- **FR-007**: System MUST provide a signup page at /signup with email and password input fields
- **FR-008**: System MUST validate email format and password length (minimum 8 characters) on the signup form before submission
- **FR-009**: System MUST call POST /auth/signup endpoint, store the returned JWT token in localStorage, and redirect to /dashboard on success
- **FR-010**: System MUST provide a login page at /login with email and password input fields
- **FR-011**: System MUST call POST /auth/login endpoint, store the returned JWT token in localStorage, and redirect to /dashboard on success
- **FR-012**: System MUST implement Next.js middleware that protects the /dashboard route by checking for JWT token in localStorage
- **FR-013**: System MUST redirect unauthenticated users from /dashboard to /login automatically
- **FR-014**: System MUST provide a logout function that clears JWT token from localStorage and redirects to /login
- **FR-015**: System MUST display a navigation bar with Login/Logout toggle based on authentication state
- **FR-016**: System MUST show the user's email in the navbar when authenticated
- **FR-017**: System MUST fetch todos via GET /todos endpoint on dashboard load, filtered automatically by JWT user_id
- **FR-018**: System MUST display an empty state message when the user has no todos
- **FR-019**: System MUST provide a form to create new todos with title (required) and description (optional) fields
- **FR-020**: System MUST call POST /todos endpoint with form data and update the UI immediately with the new todo
- **FR-021**: System MUST provide an edit function for each todo that allows updating title and description
- **FR-022**: System MUST call PUT /todos/{id} endpoint with updated data and refresh the todo in the UI
- **FR-023**: System MUST provide a delete function for each todo with confirmation
- **FR-024**: System MUST call DELETE /todos/{id} endpoint and remove the todo from the UI immediately
- **FR-025**: System MUST provide a checkbox for each todo to toggle completion status
- **FR-026**: System MUST call PATCH /todos/{id}/complete endpoint and update the UI with visual feedback (strikethrough or color change)
- **FR-027**: System MUST implement optimistic UI updates for completion toggle (update UI before API response)
- **FR-028**: System MUST display loading states (spinners or skeleton screens) during API calls
- **FR-029**: System MUST display toast notifications for success and error messages
- **FR-030**: System MUST implement responsive design that works on mobile (320px+), tablet (768px+), and desktop (1024px+) screen sizes
- **FR-031**: System MUST validate form inputs with inline error messages before submission
- **FR-032**: System MUST use Server Components by default and Client Components only when needed (forms, interactive elements)
- **FR-033**: System MUST persist authentication state across page refreshes by reading JWT from localStorage on app initialization
- **FR-034**: System MUST handle API errors gracefully with user-friendly error messages (no raw error objects shown to users)

### Key Entities

- **User**: Represents an authenticated user with email address and JWT token stored in localStorage
- **Todo**: Represents a task item with id (UUID), user_id (UUID), title (string, max 255 chars), description (optional string, max 1000 chars), is_completed (boolean), and created_at (timestamp)
- **AuthToken**: JWT token string stored in localStorage under key "auth_token", contains user_id, email, and expiration (7 days)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the signup process in under 1 minute with valid credentials
- **SC-002**: Users can log in and access their dashboard in under 10 seconds
- **SC-003**: Todo creation, editing, and deletion operations complete in under 2 seconds with visual feedback
- **SC-004**: Multi-tenant isolation is verified: User A cannot see or access User B's todos under any circumstances
- **SC-005**: Application is fully responsive and usable on screens from 320px to 1920px width
- **SC-006**: All forms display validation errors before submission, preventing invalid API calls
- **SC-007**: Loading states are visible for all operations taking longer than 500ms
- **SC-008**: Error messages are user-friendly and actionable (no technical jargon or stack traces)
- **SC-009**: JWT token persists across page refreshes and browser sessions until expiration (7 days)
- **SC-010**: Protected routes redirect unauthenticated users to login within 100ms of page load
- **SC-011**: Completion toggle provides immediate visual feedback (optimistic update) within 100ms of click
- **SC-012**: Application handles network errors gracefully without crashing or losing user data

## Scope *(mandatory)*

### In Scope

- Next.js 16 App Router project setup with TypeScript and Tailwind CSS
- Axios API client with JWT interceptors for authentication
- Signup and login pages with form validation
- Protected dashboard route with middleware
- Todo CRUD operations (Create, Read, Update, Delete)
- Completion toggle with visual feedback
- Responsive design for mobile, tablet, and desktop
- Loading states with skeleton screens
- Toast notifications for success and error messages
- Empty state handling
- Multi-tenant data isolation verification
- Logout functionality
- Navigation bar with auth state toggle

### Out of Scope

- User profile management or settings page
- Password reset or forgot password functionality
- Email verification or confirmation
- Refresh token implementation (using simple access tokens only)
- Advanced state management libraries (Redux, Zustand, MobX)
- Server-side rendering of protected data
- Real-time updates via WebSockets
- Todo categories, tags, or filtering
- Todo search functionality
- Todo sorting or reordering
- User avatars or profile pictures
- Dark mode toggle
- Internationalization (i18n)
- Accessibility testing beyond basic ARIA attributes
- Unit or integration tests
- Backend modifications or enhancements

## Assumptions *(mandatory)*

- FastAPI backend is running on http://localhost:8001 and is accessible
- Backend API contracts match the specifications from Sprint B (002-fastapi-backend-auth)
- JWT tokens are valid for 7 days as configured in the backend
- Users have modern browsers with JavaScript enabled and localStorage available
- Users have stable internet connection for API calls
- CORS is properly configured on the backend to allow requests from http://localhost:3000
- Node.js 18+ and npm/yarn are installed on the development machine
- Users understand basic web application concepts (login, forms, buttons)
- No concurrent editing conflict resolution is needed for MVP
- Last write wins for concurrent edits from multiple sessions
- Frontend will run on http://localhost:3000 during development
- No backend code changes are required or allowed during this sprint

## Dependencies *(mandatory)*

### External Dependencies

- **FastAPI Backend (Sprint B)**: Frontend depends on the completed backend API from 002-fastapi-backend-auth running on http://localhost:8001
- **Database**: Backend must have access to Neon PostgreSQL database with user and todo tables
- **CORS Configuration**: Backend must allow requests from http://localhost:3000

### Technical Dependencies

- Next.js 16 (App Router)
- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- Axios for HTTP requests
- React Hook Form or similar for form handling
- React Hot Toast or similar for notifications
- Node.js 18+ runtime

### Prerequisite Features

- Sprint A (001-sqlmodel-database): Database models and connection
- Sprint B (002-fastapi-backend-auth): Complete backend API with authentication and todo CRUD endpoints

## Non-Functional Requirements *(optional)*

### Performance

- Initial page load should complete in under 3 seconds on standard broadband connection
- API requests should complete in under 2 seconds under normal conditions
- UI should remain responsive during API calls (no blocking operations)
- Optimistic updates should provide immediate feedback (under 100ms)

### Usability

- Forms should have clear labels and placeholder text
- Error messages should be specific and actionable
- Loading states should indicate progress for operations over 500ms
- Touch targets should be at least 44x44px for mobile usability
- Color contrast should meet WCAG AA standards for readability

### Security

- JWT tokens stored in localStorage (acceptable for MVP, not production-grade)
- No sensitive data logged to console in production builds
- Form inputs sanitized before display to prevent XSS
- HTTPS should be used in production (HTTP acceptable for local development)

### Maintainability

- TypeScript types defined for all API responses and component props
- Components should be modular and reusable where appropriate
- Code should follow Next.js and React best practices
- Environment variables used for configuration (API URL)

## Risks & Mitigations *(optional)*

### Risk 1: JWT Token Security in localStorage

**Risk**: Storing JWT in localStorage is vulnerable to XSS attacks. If malicious JavaScript executes, it can steal the token.

**Mitigation**: For MVP, this is acceptable. Document this as a known limitation. For production, consider httpOnly cookies or more secure token storage mechanisms.

### Risk 2: Backend API Unavailability

**Risk**: If the backend is down or unreachable, the entire frontend becomes unusable.

**Mitigation**: Implement comprehensive error handling with user-friendly messages. Consider adding a health check endpoint that the frontend can ping to detect backend availability.

### Risk 3: Browser Compatibility

**Risk**: Older browsers may not support modern JavaScript features or localStorage.

**Mitigation**: Target modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions). Display a message for unsupported browsers.

### Risk 4: CORS Configuration Issues

**Risk**: Incorrect CORS settings on backend can block all API requests from frontend.

**Mitigation**: Verify CORS_ORIGINS includes http://localhost:3000 in backend .env file. Test CORS configuration before starting frontend development.

### Risk 5: Token Expiration During Active Session

**Risk**: User's JWT token expires while they're actively using the application, causing unexpected logouts.

**Mitigation**: Implement automatic logout with clear messaging when 401 errors are detected. Consider adding a token refresh mechanism in future iterations.
