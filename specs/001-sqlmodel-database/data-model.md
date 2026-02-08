# Data Model: Phase 2 – Sprint A: Database & Models

**Feature**: 001-sqlmodel-database
**Date**: 2026-02-07
**Entities**: User, Todo

## Entity: User

**Description**: Represents a registered user in the system with authentication information; has unique email and hashed password for security; serves as the owner for associated Todo items

**Fields**:
- `id` (UUID, Primary Key)
  - Type: UUID
  - Constraints: Required, Unique, Primary Key
  - Default: uuid.uuid4()
  - Description: Globally unique identifier for the user

- `email` (String)
  - Type: String
  - Constraints: Required, Unique
  - Max Length: 255 characters
  - Description: User's email address for identification and authentication

- `hashed_password` (String)
  - Type: String
  - Constraints: Required
  - Max Length: 255 characters
  - Description: BCrypt hashed password for secure authentication

**Relationships**:
- One-to-Many: User → Todo (via user_id foreign key)

**Validation Rules**:
- Email must be a valid email format
- Email must be unique across all users
- Email cannot be null
- Hashed password cannot be null

## Entity: Todo

**Description**: Represents a task or item that belongs to a specific user; contains title, description, completion status, and creation timestamp; linked to User entity through user_id foreign key relationship

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
  - Constraints: Required, Foreign Key to User.id
  - Description: Reference to the user who owns this todo item

**Relationships**:
- Many-to-One: Todo → User (via user_id foreign key)

**Validation Rules**:
- Title cannot be null
- User_id must reference an existing user
- is_completed defaults to False
- created_at defaults to current timestamp
- Each todo must belong to a valid user (foreign key constraint)

## Multi-Tenant Isolation Rules

**Enforcement Mechanism**:
- Every Todo must have a user_id field linking to a User
- Database-level foreign key constraint enforces user_id validity
- Application-level queries must filter by user_id to maintain isolation

**Security Requirements**:
- No user can access another user's todo items
- All queries must include user_id in WHERE clauses for proper isolation
- Direct database access should respect foreign key constraints

## Schema Information

**Database Schema**: phase2
**Naming Convention**: snake_case for all table and column names
**Table Names**:
- users: Contains User entity records
- todos: Contains Todo entity records

## Indexes

**Required Indexes**:
- users.email: Unique index for fast email lookups
- todos.user_id: Index for efficient user-based filtering
- todos.is_completed: Index for filtering completed/incomplete todos
- todos.created_at: Index for chronological ordering