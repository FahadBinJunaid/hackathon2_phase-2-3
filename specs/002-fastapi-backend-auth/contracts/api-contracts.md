# API Contracts: Phase 2 – Sprint B: Backend Engine & Auth

## Overview

This document defines the REST API contracts for authentication and todo management endpoints. All endpoints follow RESTful conventions and return JSON responses.

## Base URL

```
http://localhost:8000
```

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Common Response Codes

- `200 OK`: Successful request
- `201 Created`: Resource successfully created
- `204 No Content`: Successful deletion
- `400 Bad Request`: Malformed request
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Valid authentication but insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Resource already exists
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Unexpected server error

## Error Response Format

All error responses follow this structure:

```json
{
  "detail": "Human-readable error message"
}
```

For validation errors (422), the response includes field-specific details:

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

---

## Authentication Endpoints

### POST /auth/signup

Create a new user account and return an access token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Request Schema**:
- `email` (string, required): Valid email address
- `password` (string, required): Minimum 8 characters

**Success Response** (201 Created):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses**:
- `409 Conflict`: Email already registered
  ```json
  {
    "detail": "Email already registered"
  }
  ```
- `422 Unprocessable Entity`: Invalid email format or password too short
  ```json
  {
    "detail": [
      {
        "loc": ["body", "password"],
        "msg": "ensure this value has at least 8 characters",
        "type": "value_error.any_str.min_length"
      }
    ]
  }
  ```

**Example**:
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass123"}'
```

---

### POST /auth/login

Authenticate with existing credentials and return an access token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Request Schema**:
- `email` (string, required): Registered email address
- `password` (string, required): User's password

**Success Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
  ```json
  {
    "detail": "Invalid email or password"
  }
  ```
- `422 Unprocessable Entity`: Invalid email format
  ```json
  {
    "detail": [
      {
        "loc": ["body", "email"],
        "msg": "value is not a valid email address",
        "type": "value_error.email"
      }
    ]
  }
  ```

**Example**:
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass123"}'
```

---

## Todo Endpoints

All todo endpoints require authentication via JWT token.

### POST /todos

Create a new todo item for the authenticated user.

**Authentication**: Required

**Request Body**:
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for all endpoints"
}
```

**Request Schema**:
- `title` (string, required): Todo title, max 255 characters
- `description` (string, optional): Todo description, max 1000 characters

**Success Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for all endpoints",
  "is_completed": false,
  "created_at": "2026-02-07T12:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
  ```json
  {
    "detail": "Not authenticated"
  }
  ```
- `422 Unprocessable Entity`: Missing title or exceeds length limits
  ```json
  {
    "detail": [
      {
        "loc": ["body", "title"],
        "msg": "field required",
        "type": "value_error.missing"
      }
    ]
  }
  ```

**Example**:
```bash
curl -X POST http://localhost:8000/todos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Complete documentation","description":"Write API docs"}'
```

---

### GET /todos

Retrieve all todos for the authenticated user.

**Authentication**: Required

**Request Parameters**: None

**Success Response** (200 OK):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "is_completed": false,
    "created_at": "2026-02-07T12:00:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Review pull requests",
    "description": null,
    "is_completed": true,
    "created_at": "2026-02-06T10:30:00Z"
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
  ```json
  {
    "detail": "Not authenticated"
  }
  ```

**Example**:
```bash
curl -X GET http://localhost:8000/todos \
  -H "Authorization: Bearer <token>"
```

---

### GET /todos/{id}

Retrieve a specific todo by ID. User must own the todo.

**Authentication**: Required

**Path Parameters**:
- `id` (UUID, required): Todo identifier

**Success Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "is_completed": false,
  "created_at": "2026-02-07T12:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Todo doesn't exist or user doesn't own it
  ```json
  {
    "detail": "Todo not found"
  }
  ```

**Example**:
```bash
curl -X GET http://localhost:8000/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>"
```

---

### PUT /todos/{id}

Update a todo's title and/or description. User must own the todo.

**Authentication**: Required

**Path Parameters**:
- `id` (UUID, required): Todo identifier

**Request Body**:
```json
{
  "title": "Updated title",
  "description": "Updated description"
}
```

**Request Schema**:
- `title` (string, optional): New title, max 255 characters
- `description` (string, optional): New description, max 1000 characters

**Success Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Updated title",
  "description": "Updated description",
  "is_completed": false,
  "created_at": "2026-02-07T12:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Todo doesn't exist or user doesn't own it
- `422 Unprocessable Entity`: Validation error

**Example**:
```bash
curl -X PUT http://localhost:8000/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","description":"Updated description"}'
```

---

### DELETE /todos/{id}

Delete a todo. User must own the todo.

**Authentication**: Required

**Path Parameters**:
- `id` (UUID, required): Todo identifier

**Success Response** (204 No Content):
No response body

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Todo doesn't exist or user doesn't own it

**Example**:
```bash
curl -X DELETE http://localhost:8000/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>"
```

---

### PATCH /todos/{id}/complete

Toggle the completion status of a todo. User must own the todo.

**Authentication**: Required

**Path Parameters**:
- `id` (UUID, required): Todo identifier

**Request Body**: None

**Success Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "is_completed": true,
  "created_at": "2026-02-07T12:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Todo doesn't exist or user doesn't own it

**Example**:
```bash
curl -X PATCH http://localhost:8000/todos/550e8400-e29b-41d4-a716-446655440000/complete \
  -H "Authorization: Bearer <token>"
```

---

## Health Check Endpoint

### GET /health

Check if the API server is running.

**Authentication**: Not required

**Success Response** (200 OK):
```json
{
  "status": "healthy"
}
```

**Example**:
```bash
curl -X GET http://localhost:8000/health
```

---

## Multi-Tenant Isolation

All todo endpoints enforce strict multi-tenant isolation:

1. **Automatic User Association**: POST /todos automatically links the todo to the authenticated user
2. **Filtered Queries**: GET /todos returns only the authenticated user's todos
3. **Ownership Verification**: GET/PUT/DELETE/PATCH /todos/{id} verify the todo belongs to the authenticated user
4. **403 vs 404**: For security, ownership violations return 404 (not 403) to avoid leaking information about other users' todos

## JWT Token Structure

Tokens are signed with HS256 algorithm and contain:

```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "exp": 1234567890
}
```

- **Expiration**: 7 days from creation
- **Format**: Bearer token in Authorization header
- **Validation**: Signature verified with JWT_SECRET from environment

## Rate Limiting

Not implemented in Sprint B. Consider adding in future sprints for production deployment.

## Pagination

Not implemented in Sprint B. GET /todos returns all user's todos. Consider adding pagination in future sprints for users with many todos.
