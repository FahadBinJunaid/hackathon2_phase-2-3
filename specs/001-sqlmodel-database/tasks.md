---
description: "Task list for Phase 2 – Sprint A: Database & Models"
---

# Tasks: Phase 2 – Sprint A: Database & Models

**Input**: Design documents from `/specs/001-sqlmodel-database/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No tests requested in this feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app structure: `backend/` for all database and model code
- `frontend/` folder remains untouched in this sprint

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend directory structure with models subdirectory
- [X] T002 [P] Create .gitignore file in repository root to exclude .env and venv
- [X] T003 [P] Create requirements.txt in backend/ with sqlmodel, asyncpg, python-dotenv dependencies
- [X] T004 Generate .env file in backend/ with DATABASE_URL and randomly generated JWT_SECRET

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create database connection module in backend/db.py with async engine and session management
- [X] T006 Create __init__.py in backend/models/ directory for package initialization

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Database Connection Validation (Priority: P1) 🎯 MVP

**Goal**: Establish and validate a reliable connection to the Neon PostgreSQL database

**Independent Test**: The database connection can be validated by establishing a connection to the Neon PostgreSQL instance and performing a simple query to confirm connectivity.

### Implementation for User Story 1

- [X] T007 [US1] Create connection test script in backend/test_connection.py to validate database connectivity
- [X] T008 [US1] Execute test_connection.py to verify successful connection to Neon PostgreSQL
- [X] T009 [US1] Create phase2 schema in Neon database if it doesn't exist

**Checkpoint**: At this point, User Story 1 should be fully functional - database connection is established and validated

---

## Phase 4: User Story 2 - User Model Creation (Priority: P2)

**Goal**: Create the User model to store user information with UUID primary keys and unique email constraints

**Independent Test**: The User model can be created, saved, and retrieved from the database with all required fields properly stored.

### Implementation for User Story 2

- [X] T010 [US2] Create User model in backend/models/user.py with id (UUID), email (unique), and hashed_password fields
- [X] T011 [US2] Create database initialization script in backend/init_db.py to create tables
- [X] T012 [US2] Execute init_db.py to create phase2.users table in Neon database
- [X] T013 [US2] Verify users table exists with correct schema and constraints in Neon database

**Checkpoint**: At this point, User Story 2 should be fully functional - User model is created and table exists in database

---

## Phase 5: User Story 3 - Todo Model Creation with Multi-Tenant Support (Priority: P3)

**Goal**: Create the Todo model with proper foreign key relationship to User, enforcing multi-tenant isolation

**Independent Test**: A todo can be created and associated with a specific user, and the foreign key relationship is maintained properly.

### Implementation for User Story 3

- [X] T014 [US3] Create Todo model in backend/models/todo.py with id (UUID), title, description, is_completed, created_at, and user_id (foreign key) fields
- [X] T015 [US3] Update init_db.py to include Todo model import and table creation
- [X] T016 [US3] Execute updated init_db.py to create phase2.todos table with foreign key constraint
- [X] T017 [US3] Verify todos table exists with correct schema, indexes, and foreign key constraint to users table
- [X] T018 [US3] Validate multi-tenant isolation by confirming user_id foreign key constraint is enforced

**Checkpoint**: All user stories should now be independently functional - complete database foundation is established

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T019 [P] Verify all database tables follow snake_case naming convention
- [X] T020 [P] Confirm all primary keys use UUID format as specified
- [X] T021 [P] Validate that .env file is properly excluded from git via .gitignore
- [X] T022 Run quickstart.md validation to ensure all setup steps work correctly
- [X] T023 Document any deviations from original plan in specs/001-sqlmodel-database/plan.md

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
- **User Story 3 (P3)**: Depends on User Story 2 completion - requires User model to exist for foreign key relationship

### Within Each User Story

- User Story 1: Connection test → Schema creation (sequential)
- User Story 2: Model creation → Table initialization → Verification (sequential)
- User Story 3: Model creation → Update init script → Table creation → Validation (sequential)

### Parallel Opportunities

- Phase 1: T002 (.gitignore) and T003 (requirements.txt) can run in parallel
- Phase 2: T005 (db.py) and T006 (__init__.py) can run in parallel
- Phase 6: T019, T020, T021 can run in parallel
- User Stories 1 and 2 can be worked on in parallel by different team members after Foundational phase
- User Story 3 must wait for User Story 2 to complete (foreign key dependency)

---

## Parallel Example: Setup Phase

```bash
# Launch parallel tasks in Phase 1:
Task: "Create .gitignore file in repository root to exclude .env and venv"
Task: "Create requirements.txt in backend/ with sqlmodel, asyncpg, python-dotenv dependencies"

# Launch parallel tasks in Phase 2:
Task: "Create database connection module in backend/db.py with async engine and session management"
Task: "Create __init__.py in backend/models/ directory for package initialization"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test database connection independently
5. Confirm connection works before proceeding

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test connection independently → Validate (MVP!)
3. Add User Story 2 → Test User model independently → Validate
4. Add User Story 3 → Test Todo model with multi-tenant isolation → Validate
5. Each story adds value without breaking previous stories

### Sequential Strategy (Recommended for this feature)

Due to foreign key dependencies:

1. Complete Setup + Foundational together
2. Complete User Story 1 (connection validation)
3. Complete User Story 2 (User model - required for US3)
4. Complete User Story 3 (Todo model with foreign key to User)
5. Complete Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No tests included as not requested in specification
- All work confined to backend/ directory
- Frontend folder remains untouched
- User Story 3 has hard dependency on User Story 2 (foreign key relationship)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All database operations use async patterns for scalability
