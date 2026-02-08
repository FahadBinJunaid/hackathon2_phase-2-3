---
id: 0002
title: nextjs-frontend-plan
stage: plan
date: 2026-02-07
surface: agent
model: claude-sonnet-4-5
feature: 003-nextjs-frontend-integration
branch: 003-nextjs-frontend-integration
user: user
command: /sp.plan
labels: ["frontend", "nextjs", "planning", "architecture", "api-integration", "react-hooks"]
links:
  spec: specs/003-nextjs-frontend-integration/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-nextjs-frontend-integration/plan.md
  - specs/003-nextjs-frontend-integration/research.md
  - specs/003-nextjs-frontend-integration/data-model.md
  - specs/003-nextjs-frontend-integration/contracts/api-integration.md
  - specs/003-nextjs-frontend-integration/quickstart.md
tests:
  - None (planning phase)
---

## Prompt

/sp.plan

Phase 2 – Sprint C: Frontend UI & Backend Integration Plan

Context:
Backend ready at http://localhost:8001. Building Next.js frontend with authentication and todo management.

Architecture Decisions:

1. Framework: Next.js 16 App Router
   - Server Components by default (better performance)
   - Client Components only for interactivity
   - Built-in routing with middleware support

2. State Management: React Hooks
   - useState/useEffect for component state
   - Custom hooks (useAuth, useTodos) for reusability
   - No Redux/Zustand (keeping it simple)

3. API Communication: Axios
   - Centralized instance with interceptors
   - Automatic JWT header injection
   - Global error handling

4. Auth Strategy: JWT in localStorage
   - Simple token storage
   - Authorization: Bearer <token> header
   - Middleware for route protection

5. Styling: Tailwind CSS
   - Utility-first approach
   - Mobile-first responsive design
   - Consistent spacing and colors

Implementation Phases:

Phase C1: Project Setup & API Layer
Phase C2: Authentication Context & Hooks
Phase C3: Auth Pages
Phase C4: Route Protection
Phase C5: Dashboard Layout & Navigation
Phase C6: Todo CRUD Components
Phase C7: Completion Toggle
Phase C8: UI/UX Polish
Phase C9: Integration Testing

[Full implementation details provided in user input]

## Response snapshot

Created comprehensive implementation plan for Next.js Frontend UI & Backend Integration (003-nextjs-frontend-integration).

**Planning Artifacts Created:**

1. **plan.md** (9 implementation phases):
   - Phase C1: Project Setup & API Layer (Axios with interceptors)
   - Phase C2: Authentication Context & Hooks (useAuth custom hook)
   - Phase C3: Auth Pages (signup/login with validation)
   - Phase C4: Route Protection (Next.js middleware)
   - Phase C5: Dashboard Layout & Navigation (Navbar component)
   - Phase C6: Todo CRUD Components (useTodos hook, TodoForm, TodoList, TodoItem)
   - Phase C7: Completion Toggle (optimistic updates)
   - Phase C8: UI/UX Polish (loading states, toast notifications, responsive design)
   - Phase C9: Integration Testing (auth flow, CRUD, multi-tenant, persistence, responsive)

2. **research.md** (Phase 0):
   - Next.js 16 App Router research (Server Components, performance benefits)
   - React Hooks vs Redux/Zustand comparison (chose Hooks for simplicity)
   - Axios vs Fetch API analysis (chose Axios for interceptors)
   - JWT localStorage vs httpOnly cookies (localStorage for MVP, documented limitation)
   - Tailwind CSS vs alternatives (chose Tailwind for utility-first approach)
   - Server vs Client Components strategy (Server by default, Client for interactivity)
   - React Hot Toast for notifications (3.5KB, lightweight)

3. **data-model.md** (Phase 1):
   - TypeScript interfaces for Auth (SignupRequest, LoginRequest, AuthResponse, JWTPayload)
   - TypeScript interfaces for Todos (Todo, TodoCreateRequest, TodoUpdateRequest)
   - Error types (ApiError, ValidationError)
   - UI state types (LoadingState, FormErrors, AuthState, TodosState)
   - Validation rules (email, password, title, description)
   - Data transformations (date formatting, error message extraction)
   - Component props types (Navbar, TodoForm, TodoList, TodoItem, LoadingSkeleton)
   - localStorage schema and helper functions

4. **contracts/api-integration.md**:
   - Complete API endpoint documentation (POST /auth/signup, POST /auth/login, GET/POST/PUT/DELETE/PATCH /todos)
   - Request/response formats with TypeScript types
   - Error handling patterns (401 → auto-logout, 409 → conflict, 422 → validation)
   - Axios configuration with interceptors
   - Multi-tenant isolation testing strategy
   - CORS configuration requirements
   - Security considerations (XSS, CSRF, JWT handling)

5. **quickstart.md**:
   - Prerequisites checklist (Node.js 18+, backend running, CORS configured)
   - Step-by-step setup (create Next.js project, install dependencies, configure .env)
   - Development workflow (create API client, types, auth helpers)
   - Testing procedures (auth flow, CRUD operations, multi-tenant isolation, responsive design)
   - Troubleshooting guide (CORS errors, 401 errors, hydration errors, localStorage issues)
   - Verification checklist before implementation

**Architecture Decisions:**
- Next.js 16 App Router for Server Components and performance
- React Hooks for state management (no Redux/Zustand needed for MVP)
- Axios with interceptors for centralized JWT handling
- JWT in localStorage (documented as MVP limitation, migrate to httpOnly cookies for production)
- Tailwind CSS for utility-first styling and responsive design
- Client Components only for interactive elements (forms, buttons, state)

**Constitution Check:** All principles satisfied (SDD compliance, layered architecture, multi-tenant isolation, agent-based development, free-tier friendly, AI-ready)

## Outcome

- ✅ Impact: Complete implementation plan created with 9 phases, comprehensive research on technology choices, detailed data models with TypeScript interfaces, API integration contracts, and quickstart guide. All planning artifacts ready for /sp.tasks phase.
- 🧪 Tests: Testing strategy defined in Phase C9 (auth flow, CRUD operations, multi-tenant isolation, persistence, responsive design). Manual testing approach documented in quickstart.md.
- 📁 Files: Created plan.md (9 phases), research.md (7 technology decisions), data-model.md (TypeScript interfaces and validation), contracts/api-integration.md (API documentation), quickstart.md (setup and troubleshooting guide).
- 🔁 Next prompts: /sp.tasks to generate detailed task breakdown from implementation phases, then /sp.implement to execute with frontend-agent
- 🧠 Reflection: User provided detailed architecture decisions and implementation phases, enabling comprehensive planning without additional research. All technology choices align with constitution principles and MVP requirements. JWT localStorage limitation documented for production migration.

## Evaluation notes (flywheel)

- Failure modes observed: None. Planning completed successfully with all required artifacts.
- Graders run and results (PASS/FAIL): Constitution check PASS (6/6 principles), Technical context complete, All phases documented with acceptance criteria
- Prompt variant (if applicable): Standard /sp.plan workflow with detailed user-provided architecture decisions
- Next experiment (smallest change to try): N/A - planning is complete and ready for task generation phase
