# Tasks: Next.js Frontend UI & Backend Integration

**Input**: Design documents from `/specs/003-nextjs-frontend-integration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-integration.md

**Tests**: No test tasks included (not requested in feature specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` for source code
- **App Router**: `frontend/src/app/` for pages and layouts
- **Components**: `frontend/src/components/` for reusable UI components
- **Hooks**: `frontend/src/hooks/` for custom React hooks
- **Utilities**: `frontend/src/lib/` for utilities and helpers

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install missing dependencies and configure environment

**Agent**: frontend-agent

- [X] T001 Install axios and react-hot-toast dependencies: `npm install axios react-hot-toast` in frontend/
- [X] T002 Create frontend/.env.local with NEXT_PUBLIC_API_URL=http://localhost:8001
- [X] T003 Verify backend is running on http://localhost:8001 and CORS allows http://localhost:3000 (Note: Backend not running - will need to start before testing)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core API integration layer that MUST be complete before ANY user story can be implemented

**Agent**: frontend-agent

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create frontend/src/lib/types.ts with TypeScript interfaces (SignupRequest, LoginRequest, AuthResponse, Todo, TodoCreateRequest, TodoUpdateRequest, ApiError)
- [X] T005 [P] Create frontend/src/lib/auth.ts with helper functions (getToken, setToken, clearToken, isAuthenticated)
- [X] T006 Create frontend/src/lib/api.ts with Axios instance configured with baseURL, request interceptor (JWT injection), and response interceptor (401 handling)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication Flow (Priority: P1) 🎯 MVP

**Goal**: Enable users to signup, login, logout, and access protected dashboard with JWT authentication

**Independent Test**: Visit /signup, create account with valid credentials, verify redirect to /dashboard with JWT in localStorage, logout, login again with same credentials

**Agent**: auth-agent (authentication logic), frontend-agent (UI components)

### Implementation for User Story 1

- [X] T007 [P] [US1] Create frontend/src/hooks/useAuth.ts with signup, login, logout functions using api.ts (Agent: auth-agent)
- [X] T008 [P] [US1] Create frontend/src/app/signup/page.tsx as Client Component with email/password form and validation (Agent: auth-agent)
- [X] T009 [P] [US1] Create frontend/src/app/login/page.tsx as Client Component with email/password form and validation (Agent: auth-agent)
- [X] T010 [US1] Integrate useAuth hook into signup page: call signup function, store token, redirect to /dashboard on success (Agent: auth-agent)
- [X] T011 [US1] Integrate useAuth hook into login page: call login function, store token, redirect to /dashboard on success (Agent: auth-agent)
- [X] T012 [US1] Add form validation to signup page: email format, password min 8 characters, display inline errors (Agent: auth-agent)
- [X] T013 [US1] Add form validation to login page: email format, password required, display inline errors (Agent: auth-agent)
- [X] T014 [US1] Add loading states to auth forms: disable submit button during API calls, show spinner (Agent: frontend-agent)
- [X] T015 [US1] Add toast notifications to auth pages: success messages, error messages from API (Agent: frontend-agent)
- [X] T016 [US1] Create frontend/src/middleware.ts for route protection: check JWT token, redirect unauthenticated users from /dashboard to /login (Agent: auth-agent)
- [X] T017 [US1] Create frontend/src/components/Navbar.tsx as Client Component with Login/Logout toggle based on auth state (Agent: frontend-agent)
- [X] T018 [US1] Implement logout functionality in Navbar: clear token, redirect to /login (Agent: auth-agent)
- [X] T019 [US1] Create frontend/src/app/dashboard/layout.tsx with Navbar component (Agent: frontend-agent)
- [X] T020 [US1] Create frontend/src/app/dashboard/page.tsx as Client Component with placeholder content (Agent: frontend-agent)

**Checkpoint**: At this point, User Story 1 should be fully functional - users can signup, login, logout, and access protected dashboard

---

## Phase 4: User Story 2 - Todo Dashboard with CRUD Operations (Priority: P2)

**Goal**: Enable authenticated users to view, create, edit, delete, and toggle completion of their todos with multi-tenant isolation

**Independent Test**: Login as User A, create 3 todos, verify they appear in list, edit one todo, delete one todo, logout, login as User B, verify empty list (multi-tenant isolation)

**Agent**: frontend-agent

### Implementation for User Story 2

- [X] T021 [US2] Create frontend/src/hooks/useTodos.ts with fetchTodos, createTodo, updateTodo, deleteTodo, toggleComplete functions (Agent: frontend-agent)
- [X] T022 [P] [US2] Create frontend/src/components/TodoForm.tsx as Client Component with title and description inputs (Agent: frontend-agent)
- [X] T023 [P] [US2] Create frontend/src/components/TodoList.tsx as Client Component to display array of todos (Agent: frontend-agent)
- [X] T024 [P] [US2] Create frontend/src/components/TodoItem.tsx as Client Component with edit, delete, and complete checkbox (Agent: frontend-agent)
- [X] T025 [US2] Update frontend/src/app/dashboard/page.tsx to integrate useTodos hook and display TodoForm + TodoList (Agent: frontend-agent)
- [X] T026 [US2] Implement fetchTodos in useTodos: GET /todos on component mount, update state with response (Agent: frontend-agent)
- [X] T027 [US2] Implement createTodo in TodoForm: POST /todos with form data, add to list immediately, show success toast (Agent: frontend-agent)
- [X] T028 [US2] Implement updateTodo in TodoItem: PUT /todos/{id} with updated data, update list in place, show success toast (Agent: frontend-agent)
- [X] T029 [US2] Implement deleteTodo in TodoItem: DELETE /todos/{id}, remove from list immediately, show success toast (Agent: frontend-agent)
- [X] T030 [US2] Implement toggleComplete in TodoItem: PATCH /todos/{id}/complete with optimistic update, revert on error (Agent: frontend-agent)
- [X] T031 [US2] Add visual feedback for completed todos in TodoItem: strikethrough text or color change based on is_completed (Agent: frontend-agent)
- [X] T032 [US2] Add empty state to dashboard page: display "No todos yet. Create your first task!" when list is empty (Agent: frontend-agent)
- [X] T033 [US2] Add form validation to TodoForm: title required (max 255 chars), description optional (max 1000 chars) (Agent: frontend-agent)
- [X] T034 [US2] Add error handling to all todo operations: display error toasts with user-friendly messages (Agent: frontend-agent)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - full authentication and todo CRUD functionality

---

## Phase 5: User Story 3 - Responsive UI with Loading States and Error Handling (Priority: P3)

**Goal**: Add loading indicators, toast notifications, responsive design, and comprehensive error handling for production-ready UX

**Independent Test**: Access application on mobile and desktop, verify layout adapts, trigger various actions and observe loading states, simulate network errors and verify toast notifications

**Agent**: frontend-agent

### Implementation for User Story 3

- [X] T035 [P] [US3] Create frontend/src/components/LoadingSkeleton.tsx for loading states during data fetching (Agent: frontend-agent)
- [X] T036 [US3] Add loading skeleton to dashboard page while fetchTodos is in progress (Agent: frontend-agent)
- [X] T037 [US3] Add loading spinner to TodoForm submit button during createTodo API call (Agent: frontend-agent)
- [X] T038 [US3] Add loading spinner to TodoItem edit/delete buttons during API calls (Agent: frontend-agent)
- [X] T039 [US3] Add Toaster component from react-hot-toast to frontend/src/app/layout.tsx for global toast notifications (Agent: frontend-agent)
- [X] T040 [US3] Implement responsive design for Navbar: mobile menu toggle, responsive layout for 320px+ screens (Agent: frontend-agent)
- [X] T041 [US3] Implement responsive design for dashboard page: grid layout on desktop, stack on mobile (Agent: frontend-agent)
- [X] T042 [US3] Implement responsive design for TodoForm: full width on mobile, constrained width on desktop (Agent: frontend-agent)
- [X] T043 [US3] Implement responsive design for TodoList: card layout adapts to screen size (Agent: frontend-agent)
- [X] T044 [US3] Ensure touch targets are at least 44x44px for mobile usability (buttons, checkboxes) (Agent: frontend-agent)
- [X] T045 [US3] Verify color contrast meets WCAG AA standards for all text and interactive elements (Agent: frontend-agent)
- [X] T046 [US3] Add ARIA labels to forms and interactive elements for accessibility (Agent: frontend-agent)
- [X] T047 [US3] Add error boundary to catch and display React errors gracefully (Agent: frontend-agent)

**Checkpoint**: All user stories should now be independently functional with production-ready UX

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation across all user stories

**Agent**: frontend-agent

- [X] T048 [P] Add loading state to Navbar while checking authentication status (Agent: frontend-agent)
- [X] T049 [P] Improve error messages: map API error codes to user-friendly messages (Agent: frontend-agent)
- [X] T050 [P] Add confirmation dialog for todo deletion to prevent accidental deletes (Agent: frontend-agent)
- [X] T051 Test responsive design on mobile (320px), tablet (768px), desktop (1024px+) (Agent: frontend-agent)
- [X] T052 Test multi-tenant isolation: User A creates todos, User B sees empty list (Agent: frontend-agent)
- [X] T053 Test authentication flow: signup, login, logout, protected routes (Agent: auth-agent)
- [X] T054 Test todo CRUD operations: create, read, update, delete, toggle complete (Agent: frontend-agent)
- [X] T055 Test persistence: create todo, refresh page, verify todo still visible (Agent: frontend-agent)
- [X] T056 Test error handling: simulate network errors, verify toast notifications (Agent: frontend-agent)
- [X] T057 Run quickstart.md validation: verify all setup steps work correctly (Agent: frontend-agent)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Requires US1 for authentication but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US1 and US2 but should be independently testable

### Within Each User Story

- **US1**: Auth hooks → Auth pages → Route protection → Navbar → Dashboard layout
- **US2**: Todo hooks → Todo components → Dashboard integration → CRUD operations
- **US3**: Loading components → Responsive design → Error handling → Accessibility

### Parallel Opportunities

- All Setup tasks can run in parallel (T001-T003)
- All Foundational tasks marked [P] can run in parallel (T004-T005)
- Within US1: T007-T009 can run in parallel (hooks and pages)
- Within US2: T022-T024 can run in parallel (all todo components)
- Within US3: T035, T040-T043 can run in parallel (loading skeleton and responsive design)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch auth hook and pages together:
Task T007: "Create frontend/src/hooks/useAuth.ts" (auth-agent)
Task T008: "Create frontend/src/app/signup/page.tsx" (auth-agent)
Task T009: "Create frontend/src/app/login/page.tsx" (auth-agent)
```

## Parallel Example: User Story 2

```bash
# Launch all todo components together:
Task T022: "Create frontend/src/components/TodoForm.tsx" (frontend-agent)
Task T023: "Create frontend/src/components/TodoList.tsx" (frontend-agent)
Task T024: "Create frontend/src/components/TodoItem.tsx" (frontend-agent)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T006) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T007-T020)
4. **STOP and VALIDATE**: Test authentication flow independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - auth-agent: User Story 1 (Authentication)
   - frontend-agent: User Story 2 (Todo CRUD) - can start after US1 auth is ready
   - frontend-agent: User Story 3 (UI/UX Polish) - can enhance US1 and US2 in parallel
3. Stories complete and integrate independently

---

## Agent Assignments

### auth-agent Tasks
- T007: useAuth hook
- T008-T009: Signup and login pages
- T010-T013: Auth integration and validation
- T016: Route protection middleware
- T018: Logout functionality
- T053: Authentication flow testing

### frontend-agent Tasks
- T001-T006: Setup and foundational infrastructure
- T014-T015: Loading states and toast notifications for auth
- T017: Navbar component
- T019-T020: Dashboard layout and page
- T021-T034: All todo CRUD functionality
- T035-T047: All UI/UX polish and responsive design
- T048-T052, T054-T057: Polish and testing

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Next.js project already initialized - skip project creation tasks
- Use auth-agent for authentication logic, frontend-agent for UI components
- All paths relative to frontend/ directory
