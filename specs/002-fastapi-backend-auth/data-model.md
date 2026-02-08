# Data Model: Phase 2 – Sprint B: Backend Engine & Auth

**Feature**: 002-fastapi-backend-auth
**Date**: 2026-02-07
**Entities**: User, Todo (from Sprint A), AccessToken (logical entity)

## Entity: User

**Description**: Represents a registered user account with authentication credentials. Created in Sprint A (001-sqlmodel-database). Used for authentication and as the owner for todos.

**Source**: backend/models/user.py (existing from Sprint A)

**Fields**:
- `id` (UUID, Primary Key)
  - Type: UUID
  - Constraints: Required, Unique, Primary Key
  - Default: uuid.uuid4()
  - Description: Globally unique identifier for the user

- `email` (String)
  - Type: String
  - Constraints: Required, Unique, Indexed
  - Max Length: 255 characters
  - Description: User's email address for identification and authentication
  - Validation: Must be valid email format (enforced at API layer)

- `hashed_password` (String)
  - Type: String
  - Constraints: Required
  - Max Length: 255 characters
  - Description: Bcrypt hashed password (10 rounds) for secure authentication
  - Security: Never returned in API responses

**Relationships**:
- One-to-Many: User → Todo (via user_id foreign key)

**Validation Rules**:
- Email must be valid email format
- Email must be unique across all users
- Email cannot be null
- Hashed password cannot be null
- Password must be at least 8 characters before hashing (enforced at API layer)

**API Representation**:
```json
{
  "id": "uuid-string",
  "email": "user@example.com"
}
```
Note: hashed_password is never included in API responses

## Entity: Todo

**Description**: Represents a task item that belongs to a specific user. Created in Sprint A (001-sqlmodel-database). Linked to User entity through user_id foreign key for multi-tenant isolation.

**Source**: backend/models/todo.py (existing from Sprint A)

**Fields**:
- `id` (UUID, Primary Key)
  - Type: UUID
  - Constraints: Required, Unique, Primary Key
  - Default: uuid.uuid4()
  - Description: Globally unique identifier for the todo item

- `title` (String)
  - Type: String
  - Constraints: Required
  - Max Length: 255 characters
  - Description: Title or subject of the todo item

- `description` (String, Optional)
  - Type: String
  - Constraints: Optional
  - Max Length: 1000 characters
  - Description: Detailed description of the todo item

- `is_completed` (Boolean)
  - Type: Boolean
  - Constraints: Required
  - Default: False
  - Description: Flag indicating whether the todo is completed

- `created_at` (DateTime)
  - Type: DateTime
  - Constraints: Required
  - Default: datetime.utcnow()
  - Description: Timestamp when the todo was created

- `user_id` (UUID, Foreign Key)
  - Type: UUID
  - Constraints: Required, Foreign Key to User.id, Indexed
  - Description: Reference to the user who owns this todo item
  - Multi-Tenant: Enforces data isolation between users

**Relationships**:
- Many-to-One: Todo → User (via user_id foreign key)

**Validation Rules**:
- Title cannot be null
- Title cannot be empty string
- User_id must reference an existing user
- is_completed defaults to False
- created_at defaults to current timestamp
- Each todo must belong to a valid user (foreign key constraint)

**API Representation**:
```json
{
  "id": "uuid-string",
  "user_id": "uuid-string",
  "title": "Task title",
  "description": "Optional description",
  "is_completed": false,
  "created_at": "2026-02-07T12:00:00Z"
}
```

## Logical Entity: AccessToken

**Description**: Represents a JWT authentication token containing user identity and expiration. Not stored in database (stateless authentication). Generated upon successful login or signup.

**Token Payload Structure**:
```json
{
  "user_id": "uuid-string",
  "email": "user@example.com",
  "exp": 1234567890
}
```

**Fields**:
- `user_id` (String/UUID)
  - Description: User's unique identifier
  - Used to identify the authenticated user in API requests

- `email` (String)
  - Description: User's email address
  - Included for convenience and debugging

- `exp` (Integer)
  - Description: Token expiration timestamp (Unix epoch)
  - Default: Current time + 7 days (604800 seconds)

**Token Properties**:
- Algorithm: HS256 (HMAC with SHA-256)
- Secret: Stored in JWT_SECRET environment variable
- Expiration: 7 days from creation
- Format: Bearer token in Authorization header

**API Representation**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

## Multi-Tenant Isolation Rules

**Enforcement Mechanism**:
- Every Todo must have a user_id field linking to a User
- Database-level foreign key constraint enforces user_id validity
- Application-level queries filter by user_id from JWT token
- API-level ownership verification before any update/delete operation

**Security Requirements**:
- No user can access another user's todo items
- All queries must include user_id in WHERE clauses for proper isolation
- Direct database access respects foreign key constraints
- JWT token provides authenticated user_id for all protected endpoints

**Isolation Layers**:
1. **Database Layer**: Foreign key constraint (todos.user_id → users.id)
2. **Application Layer**: Query filtering by user_id
3. **API Layer**: Ownership verification in route handlers

## Schema Information

**Database Schema**: phase2 (from Sprint A)
**Naming Convention**: snake_case for all table and column names
**Table Names**:
- users: Contains User entity records
- todos: Contains Todo entity records

## Indexes

**Existing Indexes (from Sprint A)**:
- users.email: Unique index for fast email lookups and duplicate prevention
- todos.user_id: Index for efficient user-based filtering
- todos.is_completed: Index for filtering completed/incomplete todos
- todos.created_at: Index for chronological ordering

**No Additional Indexes Required**: Existing indexes from Sprint A are sufficient for all API operations in Sprint B.

## Data Flow

**Authentication Flow**:
1. User submits email + password to POST /auth/signup or POST /auth/login
2. Backend verifies credentials (bcrypt comparison for login)
3. Backend generates JWT token with user_id and email
4. Token returned to client in TokenResponse
5. Client includes token in Authorization header for subsequent requests

**Todo CRUD Flow**:
1. Client sends request with JWT token in Authorization header
2. get_current_user dependency extracts and validates token
3. user_id extracted from token payload
4. Database query filters by user_id (for list) or verifies ownership (for single item)
5. Response includes only data belonging to authenticated user

## State Transitions

**User States**:
- Created: User registered via POST /auth/signup
- Authenticated: User logged in via POST /auth/login (receives JWT token)
- Token Expired: JWT token expires after 7 days (requires re-authentication)

**Todo States**:
- Created: is_completed = False
- Completed: is_completed = True (via PATCH /todos/{id}/complete)
- Updated: Title or description modified (via PUT /todos/{id})
- Deleted: Permanently removed from database (via DELETE /todos/{id})

## Data Validation

**User Validation**:
- Email format: Validated by Pydantic EmailStr
- Email uniqueness: Enforced by database unique constraint
- Password length: Minimum 8 characters (validated at API layer)

**Todo Validation**:
- Title required: Cannot be null or empty
- Title length: Maximum 255 characters
- Description length: Maximum 1000 characters (if provided)
- User_id validity: Enforced by foreign key constraint

**Token Validation**:
- Signature verification: HS256 algorithm with JWT_SECRET
- Expiration check: Token rejected if exp < current time
- Payload structure: Must contain user_id and email fields
