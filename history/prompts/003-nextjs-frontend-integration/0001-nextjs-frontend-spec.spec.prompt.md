---
id: 0001
title: nextjs-frontend-spec
stage: spec
date: 2026-02-07
surface: agent
model: claude-sonnet-4-5
feature: 003-nextjs-frontend-integration
branch: 003-nextjs-frontend-integration
user: user
command: /sp.specify
labels: ["frontend", "nextjs", "authentication", "todo-app", "typescript", "tailwind"]
links:
  spec: specs/003-nextjs-frontend-integration/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-nextjs-frontend-integration/spec.md
  - specs/003-nextjs-frontend-integration/checklists/requirements.md
tests:
  - None (specification phase)
---

## Prompt

/sp.specify

Phase 2 – Sprint C: Frontend UI & Backend Integration

Status Update:
✅ Sprint B (Backend & Auth) 100% COMPLETE
✅ FastAPI server running on http://localhost:8001
✅ Database isolation verified via JWT
✅ All authentication and CRUD endpoints tested
✅ Swagger docs available at http://localhost:8001/docs

Target:
Build a responsive, modern Todo application UI using Next.js App Router that integrates with the FastAPI backend.

Objectives:

1. Project Setup & API Client
   - Initialize Next.js 16 project in frontend/ folder
   - Configure environment variables (NEXT_PUBLIC_API_URL=http://localhost:8001)
   - Create Axios instance with JWT interceptors
   - Setup global error handling (401 → redirect to login)

2. Authentication UI
   - Signup Page (/signup): Email + password validation (min 8 chars)
   - Login Page (/login): Credentials input, JWT storage in localStorage
   - Store JWT token on successful login
   - Auto-redirect to /dashboard after login
   - Logout functionality (clear token, redirect to /login)

3. Protected Routes & Navigation
   - Next.js middleware to protect /dashboard route
   - Redirect unauthenticated users to /login
   - Navbar component with Login/Logout toggle based on auth state
   - Show username/email in navbar when logged in

4. Todo Dashboard (Multi-Tenant CRUD)
   - Dashboard page (/dashboard) displays only current user's tasks
   - Fetch todos via GET /todos (filtered by JWT user_id)
   - Create todo form (POST /todos with auto user_id)
   - Edit todo (PUT /todos/{id} with ownership verification)
   - Delete todo (DELETE /todos/{id} with ownership verification)
   - Real-time UI updates after mutations

5. Completion Toggle UI
   - Checkbox for each todo to toggle is_completed status
   - PATCH /todos/{id}/complete endpoint integration
   - Visual feedback: strikethrough or color change for completed tasks
   - Optimistic UI updates (update UI before API response)

6. UI/UX Polish
   - Loading states with skeleton screens
   - Toast notifications for success/error messages
   - Responsive design with Tailwind CSS (mobile-first)
   - Empty states ("No todos yet" message)
   - Form validation with error messages
   - Accessible UI (proper labels, ARIA attributes)

Success Criteria:
✓ User can signup and is automatically logged in with JWT
✓ User can login and access dashboard
✓ User can create, read, update, and delete todos
✓ Tasks persist after page refresh (JWT in localStorage)
✓ Multi-tenant isolation: User A never sees User B's tasks
✓ Protected routes redirect unauthenticated users
✓ Completion toggle works with visual feedback
✓ Responsive layout works on mobile and desktop
✓ Error handling shows user-friendly messages
✓ Loading states prevent confusion during API calls

Constraints:
- Use Next.js 16 App Router (not Pages Router)
- Use TypeScript for type safety
- Use Tailwind CSS for styling
- Use Server Components by default, Client Components only when needed
- API base URL: http://localhost:8001
- JWT stored in localStorage (simple approach)
- No changes to backend code
- All API calls must include JWT in Authorization header

Not Building:
- User profile management
- Password reset
- Email verification
- Refresh tokens (using simple access tokens)
- Advanced state management (Redux/Zustand)
- Server-side rendering of protected data

## Response snapshot

Created comprehensive feature specification for Next.js Frontend UI & Backend Integration (003-nextjs-frontend-integration).

**Specification Contents:**
- 3 prioritized user stories (P1: Authentication Flow, P2: Todo CRUD Operations, P3: Responsive UI & Error Handling)
- 34 functional requirements covering all aspects of frontend implementation
- 12 measurable success criteria focused on user outcomes
- 8 edge cases documented
- Complete scope definition (In Scope: 13 items, Out of Scope: 18 items)
- Dependencies and assumptions clearly documented
- Risk analysis with 5 identified risks and mitigations

**Quality Validation:**
- All checklist items passed
- No [NEEDS CLARIFICATION] markers needed (comprehensive user input provided)
- All requirements testable and unambiguous
- Success criteria are technology-agnostic and measurable
- Ready to proceed to /sp.plan phase

**Key Decisions:**
- JWT storage in localStorage (acceptable for MVP, documented as known limitation)
- Optimistic UI updates for completion toggle
- Last-write-wins for concurrent edits (no conflict resolution)
- Mobile-first responsive design (320px to 1920px)
- Client Components only for interactive elements (forms, buttons)

## Outcome

- ✅ Impact: Complete feature specification created for Next.js frontend integration with FastAPI backend. Specification includes 3 independently testable user stories, 34 functional requirements, and 12 measurable success criteria. All quality validation checks passed.
- 🧪 Tests: No tests at specification phase. Testing strategy defined in user stories with acceptance scenarios for each priority level.
- 📁 Files: Created spec.md (282 lines) and requirements.md checklist (validation passed). Branch 003-nextjs-frontend-integration created and checked out.
- 🔁 Next prompts: /sp.plan to create implementation plan with architecture decisions, or /sp.clarify if any requirements need refinement (none identified)
- 🧠 Reflection: User provided exceptionally detailed requirements including technical stack, constraints, success criteria, and out-of-scope items. This enabled complete specification without clarifications. Technical stack (Next.js, TypeScript, Tailwind) is part of user requirements, not implementation details added by spec.

## Evaluation notes (flywheel)

- Failure modes observed: None. Specification completed successfully with all validation checks passing.
- Graders run and results (PASS/FAIL): Requirements checklist PASS (14/14 items), Content quality PASS (4/4 items), Feature readiness PASS (4/4 items)
- Prompt variant (if applicable): Standard /sp.specify workflow with comprehensive user input
- Next experiment (smallest change to try): N/A - specification is complete and ready for planning phase
