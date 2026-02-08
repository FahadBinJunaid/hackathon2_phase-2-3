# Implementation Plan: Phase 2 – Sprint B: Backend Engine & Auth

**Branch**: `002-fastapi-backend-auth` | **Date**: 2026-02-07 | **Spec**: [specs/002-fastapi-backend-auth/spec.md](specs/002-fastapi-backend-auth/spec.md)
**Input**: Feature specification from `/specs/002-fastapi-backend-auth/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build secure FastAPI backend with JWT authentication and multi-tenant CRUD APIs for the Todo application. Implement user registration and login with bcrypt password hashing, JWT token generation and verification, and complete CRUD operations for todos with strict ownership verification. All endpoints will be documented via auto-generated Swagger/OpenAPI documentation.

## Technical Context

**Language/Version**: Python 3.13
**Primary Dependencies**: FastAPI, uvicorn, python-jose, passlib, SQLModel (existing), asyncpg (existing)
**Storage**: Neon PostgreSQL database with SQLModel ORM (existing from Sprint A)
**Testing**: pytest for unit and integration tests, FastAPI TestClient for endpoint testing
**Target Platform**: Linux server environment (async ASGI server)
**Project Type**: Web application backend (extends existing backend/ structure)
**Performance Goals**: <200ms p95 latency for API endpoints, support 100+ concurrent authenticated users
**Constraints**: Stateless JWT authentication (no session storage), 7-day token expiration, bcrypt 10 rounds for password hashing, strict multi-tenant isolation
**Scale/Scope**: 6 API endpoints (2 auth, 6 todo CRUD), JWT middleware, Pydantic schemas for validation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Spec-Driven Development (SDD) Compliance**: Following /sp.specify → /sp.plan → /sp.tasks → /sp.implement workflow
- ✅ **Layered Architecture Separation**: Backend API layer being built on top of existing database layer from Sprint A
- ✅ **Multi-Tenant Data Isolation**: JWT authentication extracts user_id, all todo queries filtered by user_id, ownership verification on all operations
- ✅ **Agent-Based Development**: Using auth-agent for authentication logic, backend-agent for API endpoints, database-agent for model validation
- ✅ **Free-Tier Friendly Infrastructure**: Using FastAPI (free), Neon PostgreSQL free tier (existing), no additional paid services
- ✅ **AI-Ready Architecture**: RESTful API design with OpenAPI documentation enables future AI agent integration

## Project Structure

### Documentation (this feature)

```text
specs/002-fastapi-backend-auth/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── .env                 # Add CORS_ORIGINS
├── requirements.txt     # Add FastAPI, uvicorn, python-jose, passlib
├── main.py              # NEW: FastAPI app, CORS, route registration
├── auth.py              # NEW: JWT utilities, password hashing, get_current_user
├── db.py                # EXISTING: Database connection from Sprint A
├── init_db.py           # EXISTING: Database initialization from Sprint A
├── test_connection.py   # EXISTING: Connection test from Sprint A
├── models/              # EXISTING: User and Todo models from Sprint A
│   ├── __init__.py
│   ├── user.py
│   └── todo.py
├── routes/              # NEW: API route modules
│   ├── __init__.py
│   ├── auth.py          # POST /auth/signup, POST /auth/login
│   └── todos.py         # CRUD endpoints for todos
└── schemas/             # NEW: Pydantic request/response schemas
    ├── __init__.py
    ├── auth.py          # SignupRequest, LoginRequest, TokenResponse
    └── todo.py          # TodoCreate, TodoRead, TodoUpdate

tests/                   # NEW: Test suite for API endpoints
├── test_auth.py         # Auth flow tests
├── test_todos.py        # Todo CRUD tests
└── test_multi_tenant.py # Multi-tenant isolation tests
```

**Structure Decision**: Web application backend extending existing backend/ directory from Sprint A. New files for FastAPI application, authentication logic, API routes, and Pydantic schemas. Existing database models and connection from Sprint A remain unchanged.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitution principles are satisfied.

## Architecture Decisions

### Decision 1: FastAPI Framework

**Rationale**: FastAPI provides async/await support for high-performance endpoints, automatic OpenAPI documentation generation, native Pydantic validation, and dependency injection system. These features align perfectly with the requirements for JWT middleware, request validation, and API documentation.

**Alternatives Considered**:
- Flask: Lacks native async support and automatic API documentation
- Django REST Framework: Too heavyweight for this use case, includes unnecessary ORM when SQLModel is already in use
- Starlette: Lower-level than FastAPI, would require manual OpenAPI documentation

**Trade-offs**: FastAPI adds ~50MB to dependencies but provides significant developer productivity and automatic documentation benefits.

### Decision 2: JWT Authentication (Stateless)

**Rationale**: JWT tokens are stateless, eliminating need for session storage. Compatible with Better Auth patterns for future frontend integration. Token payload includes user_id and email for easy user identification. 7-day expiration balances security and user convenience.

**Alternatives Considered**:
- Session-based auth: Requires session storage (Redis/database), adds infrastructure complexity
- OAuth2 with refresh tokens: Overly complex for initial implementation, can be added later
- API keys: Less secure, no expiration mechanism

**Trade-offs**: JWT tokens cannot be revoked before expiration without additional infrastructure. Acceptable for MVP with 7-day expiration.

### Decision 3: Bcrypt Password Hashing

**Rationale**: Bcrypt is industry-standard for password hashing with built-in salting and configurable work factor (10 rounds). Resistant to rainbow table and brute-force attacks. Well-supported by passlib library.

**Alternatives Considered**:
- Argon2: More modern but less widely adopted, requires additional dependencies
- PBKDF2: Older standard, less resistant to GPU-based attacks
- Scrypt: Good security but higher memory requirements

**Trade-offs**: Bcrypt 10 rounds adds ~100-200ms to signup/login operations. Acceptable for user authentication use case.

### Decision 4: Dependency Injection for Auth

**Rationale**: FastAPI's Depends() system allows reusable authentication logic across all protected endpoints. get_current_user dependency extracts and validates JWT token, returning user object. Clean separation of concerns and easy to test.

**Alternatives Considered**:
- Middleware-based auth: Less flexible, harder to exclude specific endpoints
- Decorator-based auth: Not idiomatic for FastAPI, loses type safety
- Manual token validation in each endpoint: Code duplication, error-prone

**Trade-offs**: None significant. Dependency injection is the recommended FastAPI pattern.

## Implementation Phases

### Phase 0: Research (Completed in this document)

All technical decisions documented above. No additional research required.

### Phase 1: Design Artifacts

**Deliverables**:
- data-model.md: Document User and Todo entities (reference Sprint A models)
- contracts/: OpenAPI specifications for auth and todo endpoints
- quickstart.md: Step-by-step guide to run FastAPI server and test endpoints

### Phase 2: Implementation (via /sp.tasks)

**Phase B1: Core Setup**
- Install dependencies: fastapi>=0.109.0, uvicorn[standard]>=0.27.0, python-jose[cryptography]>=3.3.0, passlib[bcrypt]>=1.7.4
- Create backend/main.py with FastAPI app initialization
- Configure CORS middleware with origins from .env
- Add health check endpoint GET /health
- Verify server starts on http://localhost:8000

**Phase B2: Authentication Layer**
- Create backend/auth.py with password hashing functions (bcrypt, 10 rounds)
- Implement JWT token creation with python-jose (HS256 algorithm)
- Implement JWT token verification and decoding
- Create get_current_user dependency to extract user from token
- Handle token expiration and invalid token errors

**Phase B3: Request/Response Schemas**
- Create backend/schemas/auth.py:
  - SignupRequest: email (EmailStr), password (str, min 8 chars)
  - LoginRequest: email (EmailStr), password (str)
  - TokenResponse: access_token (str), token_type (str)
- Create backend/schemas/todo.py:
  - TodoCreate: title (str, max 255), description (Optional[str], max 1000)
  - TodoRead: id (UUID), user_id (UUID), title, description, is_completed (bool), created_at (datetime)
  - TodoUpdate: title (Optional[str]), description (Optional[str])

**Phase B4: Auth Routes**
- Create backend/routes/auth.py:
  - POST /auth/signup: Validate email, hash password, create user, return JWT token
  - POST /auth/login: Verify credentials, return JWT token
  - Handle duplicate email (409 Conflict)
  - Handle invalid credentials (401 Unauthorized)
  - Validate password strength (min 8 characters)

**Phase B5: Todo CRUD Routes**
- Create backend/routes/todos.py:
  - POST /todos: Create todo, auto-link to current user from JWT
  - GET /todos: List todos filtered by current user_id
  - GET /todos/{id}: Get single todo, verify ownership
  - PUT /todos/{id}: Update todo, verify ownership
  - DELETE /todos/{id}: Delete todo, verify ownership
  - PATCH /todos/{id}/complete: Toggle is_completed, verify ownership
- All endpoints require JWT authentication via get_current_user dependency
- Return 403 Forbidden for ownership violations
- Return 404 Not Found for non-existent todos

**Phase B6: Integration & Testing**
- Register auth and todo routes in main.py
- Test all endpoints via FastAPI /docs (Swagger UI)
- Verify JWT authentication flow end-to-end
- Test multi-tenant isolation (User A cannot access User B's todos)
- Validate error responses (400, 401, 403, 404, 422)

## Testing Strategy

### Unit Tests
- Password hashing and verification
- JWT token creation and validation
- Pydantic schema validation

### Integration Tests
- Auth flow: signup → login → receive token
- Todo CRUD: create → read → update → delete
- Multi-tenant isolation: User A vs User B data access

### Contract Tests
- OpenAPI schema validation
- Request/response format verification
- Error response structure

### Test Scenarios

**Auth Flow Tests**:
1. POST /auth/signup with valid data → 201 Created + JWT token
2. POST /auth/signup with duplicate email → 409 Conflict
3. POST /auth/signup with invalid email → 422 Unprocessable Entity
4. POST /auth/signup with weak password → 422 Unprocessable Entity
5. POST /auth/login with correct credentials → 200 OK + JWT token
6. POST /auth/login with wrong password → 401 Unauthorized
7. POST /auth/login with non-existent email → 401 Unauthorized

**JWT Validation Tests**:
1. GET /todos without Authorization header → 401 Unauthorized
2. GET /todos with invalid token → 401 Unauthorized
3. GET /todos with expired token → 401 Unauthorized
4. GET /todos with valid token → 200 OK + user's todos

**Multi-Tenant Isolation Tests**:
1. User A creates todo → verify in database with user_id = A
2. User B requests GET /todos → does not see User A's todo
3. User B requests GET /todos/{A's_todo_id} → 404 Not Found
4. User B requests PUT /todos/{A's_todo_id} → 404 Not Found
5. User B requests DELETE /todos/{A's_todo_id} → 404 Not Found

**CRUD Operation Tests**:
1. POST /todos with valid data → 201 Created + todo object
2. POST /todos without title → 422 Unprocessable Entity
3. GET /todos → 200 OK + array of user's todos
4. GET /todos/{id} with valid id → 200 OK + todo object
5. GET /todos/{id} with invalid id → 404 Not Found
6. PUT /todos/{id} with valid data → 200 OK + updated todo
7. DELETE /todos/{id} → 204 No Content
8. PATCH /todos/{id}/complete → 200 OK + updated todo

## Dependencies

### New Dependencies to Add

```text
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.6  # For form data support
email-validator>=2.1.0   # For EmailStr validation
```

### Existing Dependencies (from Sprint A)

```text
sqlmodel
asyncpg
python-dotenv
```

## Environment Configuration

### New Environment Variables

Add to backend/.env:

```env
# Existing from Sprint A
DATABASE_URL=postgresql://...
JWT_SECRET=...

# New for Sprint B
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

## Agent Responsibilities

- **auth-agent**: Implement backend/auth.py (password hashing, JWT creation/verification), backend/routes/auth.py (signup/login endpoints)
- **backend-agent**: Implement backend/main.py (FastAPI app, CORS, route registration), backend/routes/todos.py (CRUD endpoints), backend/schemas/ (Pydantic models)
- **database-agent**: Verify existing User and Todo models work correctly with new API endpoints, validate multi-tenant isolation at database level

## Success Criteria

- ✅ FastAPI server runs on http://localhost:8000
- ✅ Swagger documentation accessible at http://localhost:8000/docs
- ✅ POST /auth/signup creates user with bcrypt-hashed password
- ✅ POST /auth/login returns valid JWT token with 7-day expiration
- ✅ All /todos endpoints reject requests without valid JWT (401)
- ✅ User A cannot access, modify, or delete User B's todos (403/404)
- ✅ All CRUD operations work correctly with phase2 schema in Neon
- ✅ Pydantic validation catches invalid inputs (422)
- ✅ Authentication errors return appropriate status codes (401, 403, 409)
- ✅ API documentation is complete and accurate

## Risk Analysis

### Risk 1: JWT Secret Security

**Impact**: If JWT_SECRET is compromised, attackers can forge valid tokens
**Mitigation**: Use strong random secret (32+ characters), store in .env, never commit to git, rotate periodically
**Contingency**: Implement token revocation list if breach detected

### Risk 2: Password Strength

**Impact**: Weak passwords compromise user accounts
**Mitigation**: Enforce minimum 8 characters, validate on backend, consider adding complexity requirements in future
**Contingency**: Implement password reset flow in future sprint

### Risk 3: Multi-Tenant Data Leakage

**Impact**: Critical security violation if users can access other users' data
**Mitigation**: Strict ownership verification on all endpoints, comprehensive integration tests, code review by auth-agent
**Contingency**: Immediate rollback if data leakage detected, security audit

### Risk 4: Token Expiration UX

**Impact**: Users logged out after 7 days may cause frustration
**Mitigation**: Clear error messages, frontend handles 401 gracefully, consider refresh tokens in future
**Contingency**: Reduce expiration to 1 day if security concerns arise, or extend to 30 days if UX issues

## Next Steps

1. Run `/sp.tasks` to generate detailed task breakdown
2. Execute tasks via `/sp.implement`
3. Test all endpoints via Swagger UI
4. Validate multi-tenant isolation
5. Proceed to Sprint C (Frontend & Integration)
