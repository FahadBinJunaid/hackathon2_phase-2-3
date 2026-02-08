# Tasks: Phase 2 – Sprint B: Backend Engine & Auth

**Input**: Design documents from `/specs/002-fastapi-backend-auth/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No tests requested in this feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app structure: `backend/` for all API code
- Extends existing backend/ directory from Sprint A

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [X] T001 Update backend/requirements.txt to add fastapi>=0.109.0, uvicorn[standard]>=0.27.0, python-jose[cryptography]>=3.3.0, passlib[bcrypt]>=1.7.4, python-multipart>=0.0.6, email-validator>=2.1.0
- [X] T002 Install new dependencies from requirements.txt using pip
- [X] T003 Add CORS_ORIGINS environment variable to backend/.env with value "http://localhost:3000,http://localhost:8000"
- [X] T004 Create backend/routes/ directory for API route modules
- [X] T005 Create backend/schemas/ directory for Pydantic request/response models

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create backend/main.py with FastAPI app initialization, CORS middleware configuration, and health check endpoint GET /health
- [X] T007 [P] Create backend/routes/__init__.py for routes package initialization
- [X] T008 [P] Create backend/schemas/__init__.py for schemas package initialization
- [X] T009 Create backend/auth.py with password hashing utilities (bcrypt with 10 rounds) and JWT token creation/verification functions using python-jose

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to create accounts and authenticate with JWT tokens

**Independent Test**: Can be fully tested by creating a new user account via POST /auth/signup, logging in with POST /auth/login, receiving a JWT token, and verifying that invalid credentials are rejected.

### Implementation for User Story 1

- [X] T010 [P] [US1] Create backend/schemas/auth.py with SignupRequest (email: EmailStr, password: str min 8 chars), LoginRequest (email: EmailStr, password: str), and TokenResponse (access_token: str, token_type: str) Pydantic models
- [X] T011 [US1] Implement get_current_user dependency function in backend/auth.py to extract and validate JWT token from Authorization header and return authenticated User object
- [X] T012 [US1] Create backend/routes/auth.py with POST /auth/signup endpoint that validates email, hashes password with bcrypt, creates user in database, and returns JWT token
- [X] T013 [US1] Implement POST /auth/login endpoint in backend/routes/auth.py that verifies credentials against database, validates password with bcrypt, and returns JWT token on success
- [X] T014 [US1] Add error handling in backend/routes/auth.py for duplicate email (409 Conflict), invalid credentials (401 Unauthorized), and validation errors (422 Unprocessable Entity)
- [X] T015 [US1] Register auth routes in backend/main.py using app.include_router with prefix "/auth"
- [X] T016 [US1] Test authentication flow via Swagger UI at /docs: signup with valid data, signup with duplicate email, login with correct credentials, login with wrong password

**Checkpoint**: At this point, User Story 1 should be fully functional - users can register and authenticate with JWT tokens

---

## Phase 4: User Story 2 - Multi-Tenant Todo Management (Priority: P2)

**Goal**: Enable authenticated users to create, view, update, and delete their personal todos with strict ownership verification

**Independent Test**: Can be tested by authenticating as User A, creating/viewing/updating/deleting todos, then authenticating as User B and verifying they cannot see or modify User A's todos.

### Implementation for User Story 2

- [X] T017 [P] [US2] Create backend/schemas/todo.py with TodoCreate (title: str max 255, description: Optional[str] max 1000), TodoRead (id: UUID, user_id: UUID, title, description, is_completed: bool, created_at: datetime), and TodoUpdate (title: Optional[str], description: Optional[str]) Pydantic models
- [X] T018 [US2] Create backend/routes/todos.py and implement POST /todos endpoint that creates todo linked to authenticated user from get_current_user dependency
- [X] T019 [US2] Implement GET /todos endpoint in backend/routes/todos.py that returns list of todos filtered by authenticated user's user_id
- [X] T020 [US2] Implement GET /todos/{id} endpoint in backend/routes/todos.py that retrieves single todo and verifies ownership (return 404 if not owned by user)
- [X] T021 [US2] Implement PUT /todos/{id} endpoint in backend/routes/todos.py that updates todo title/description after verifying ownership
- [X] T022 [US2] Implement DELETE /todos/{id} endpoint in backend/routes/todos.py that deletes todo after verifying ownership (return 204 No Content on success)
- [X] T023 [US2] Add error handling in backend/routes/todos.py for missing title (422), non-existent todo (404), and ownership violations (404 for security)
- [X] T024 [US2] Register todo routes in backend/main.py using app.include_router with prefix "/todos" and dependencies=[Depends(get_current_user)]
- [X] T025 [US2] Test multi-tenant isolation: create two users, User A creates todo, verify User B cannot access it via GET /todos or GET /todos/{id}

**Checkpoint**: At this point, User Story 2 should be fully functional - authenticated users can manage their todos with complete data isolation

---

## Phase 5: User Story 3 - Todo Completion Tracking (Priority: P3)

**Goal**: Provide quick way to toggle todo completion status without full update

**Independent Test**: Can be tested by authenticating, creating a todo, toggling its completion status via PATCH /todos/{id}/complete, and verifying the status changes correctly.

### Implementation for User Story 3

- [X] T026 [US3] Implement PATCH /todos/{id}/complete endpoint in backend/routes/todos.py that toggles is_completed field after verifying ownership
- [X] T027 [US3] Test completion toggle: create todo (is_completed=false), toggle to complete (is_completed=true), toggle back to incomplete (is_completed=false)
- [X] T028 [US3] Verify User A cannot toggle User B's todo completion status (returns 404)

**Checkpoint**: All user stories should now be independently functional - complete backend API with authentication and multi-tenant todo management

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T029 [P] Verify all endpoints return correct HTTP status codes per API contracts (201 for create, 200 for success, 204 for delete, 401 for unauthorized, 404 for not found, 409 for conflict, 422 for validation)
- [X] T030 [P] Verify JWT tokens include user_id, email, and exp fields with 7-day expiration
- [X] T031 [P] Verify password hashing uses bcrypt with 10 rounds and passwords are never returned in responses
- [X] T032 Test complete authentication flow: signup → login → create todo → list todos → update todo → delete todo
- [X] T033 Verify Swagger documentation at /docs is complete and accurate for all endpoints
- [X] T034 Run quickstart.md validation to ensure all setup steps work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)
- **User Story 3 (P3)**: Depends on User Story 2 completion - requires todo CRUD endpoints to exist

### Within Each User Story

- User Story 1: Schemas → Auth utilities → Auth routes → Route registration → Testing (sequential)
- User Story 2: Schemas → Todo routes (all CRUD) → Route registration → Multi-tenant testing (sequential within, but individual CRUD endpoints can be parallel)
- User Story 3: Completion endpoint → Testing (sequential)

### Parallel Opportunities

- Phase 1: T001-T005 can all run in parallel (different files)
- Phase 2: T007 and T008 can run in parallel (different __init__.py files)
- Phase 3 (US1): T010 can run in parallel with T011 (different concerns)
- Phase 4 (US2): T017 (schemas) can run in parallel with route implementations if schemas are defined first
- Phase 6: T029, T030, T031 can run in parallel (different verification tasks)
- User Stories 1 and 2 can be worked on in parallel by different team members after Foundational phase

---

## Parallel Example: User Story 1

```bash
# Launch parallel tasks in Phase 3:
Task: "Create backend/schemas/auth.py with Pydantic models"
Task: "Implement get_current_user dependency in backend/auth.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test authentication via Swagger UI
5. Confirm signup and login work before proceeding

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test authentication independently → Validate (MVP!)
3. Add User Story 2 → Test todo CRUD independently → Validate
4. Add User Story 3 → Test completion toggle independently → Validate
5. Each story adds value without breaking previous stories

### Sequential Strategy (Recommended for this feature)

1. Complete Setup + Foundational together
2. Complete User Story 1 (authentication - required for all protected endpoints)
3. Complete User Story 2 (todo CRUD - core functionality)
4. Complete User Story 3 (completion toggle - convenience feature)
5. Complete Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No tests included as not requested in specification
- All work confined to backend/ directory
- User Story 3 depends on User Story 2 (needs todo endpoints to exist)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All endpoints use async patterns for scalability
- JWT authentication required for all /todos endpoints
- Multi-tenant isolation enforced at query level (filter by user_id)
