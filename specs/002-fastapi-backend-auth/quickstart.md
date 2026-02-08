# Quickstart Guide: Phase 2 – Sprint B: Backend Engine & Auth

**Feature**: 002-fastapi-backend-auth
**Date**: 2026-02-07

## Overview

This quickstart guide provides the essential steps to set up and run the FastAPI backend with JWT authentication and todo CRUD APIs. This builds on the database foundation from Sprint A.

## Prerequisites

- Python 3.13 or higher
- Completed Sprint A (001-sqlmodel-database)
- Access to Neon PostgreSQL database
- pip package manager
- Virtual environment (recommended)

## Setup Instructions

### 1. Navigate to Project

```bash
cd "phase 2"
```

### 2. Activate Virtual Environment

If you created a virtual environment in Sprint A, activate it:

```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install New Dependencies

```bash
cd backend
pip install fastapi>=0.109.0 uvicorn[standard]>=0.27.0 python-jose[cryptography]>=3.3.0 passlib[bcrypt]>=1.7.4 python-multipart>=0.0.6 email-validator>=2.1.0
```

Or update requirements.txt and install:

```bash
pip install -r requirements.txt
```

### 4. Verify Environment Variables

Ensure your backend/.env file contains:

```env
DATABASE_URL=postgresql://neondb_owner:npg_Xw3QpPnSF1LN@ep-delicate-credit-ait8yp8b-pooler.c-4.us-east-1.aws.neon.tech/neondb?ssl=require
JWT_SECRET=<your-secret-from-sprint-a>
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

If CORS_ORIGINS is missing, add it to the .env file.

### 5. Verify Database Connection

Before starting the API server, verify the database is accessible:

```bash
python test_connection.py
```

Expected output:
```
[OK] Database connection successful!
[OK] Schema 'phase2' created or already exists
[OK] Schema verification successful: phase2
```

## Running the FastAPI Server

### Start the Development Server

From the backend/ directory:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

The `--reload` flag enables auto-reload on code changes (development only).

### Verify Server is Running

Open your browser and navigate to:

```
http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy"
}
```

## Testing with Swagger UI

FastAPI automatically generates interactive API documentation.

### Access Swagger UI

Navigate to:

```
http://localhost:8000/docs
```

You should see the Swagger UI with all available endpoints.

### Test Authentication Flow

**Step 1: Create a User Account**

1. In Swagger UI, expand `POST /auth/signup`
2. Click "Try it out"
3. Enter request body:
   ```json
   {
     "email": "test@example.com",
     "password": "testpass123"
   }
   ```
4. Click "Execute"
5. Expected response (201 Created):
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "token_type": "bearer"
   }
   ```
6. **Copy the access_token value** (you'll need it for subsequent requests)

**Step 2: Authorize in Swagger UI**

1. Click the "Authorize" button at the top of the Swagger UI
2. In the "Value" field, enter: `Bearer <your-access-token>`
   - Replace `<your-access-token>` with the token from Step 1
   - Make sure to include "Bearer " before the token
3. Click "Authorize"
4. Click "Close"

You are now authenticated for all protected endpoints.

**Step 3: Create a Todo**

1. Expand `POST /todos`
2. Click "Try it out"
3. Enter request body:
   ```json
   {
     "title": "Test todo",
     "description": "This is a test todo item"
   }
   ```
4. Click "Execute"
5. Expected response (201 Created):
   ```json
   {
     "id": "550e8400-e29b-41d4-a716-446655440000",
     "user_id": "123e4567-e89b-12d3-a456-426614174000",
     "title": "Test todo",
     "description": "This is a test todo item",
     "is_completed": false,
     "created_at": "2026-02-07T12:00:00Z"
   }
   ```

**Step 4: List Your Todos**

1. Expand `GET /todos`
2. Click "Try it out"
3. Click "Execute"
4. Expected response (200 OK):
   ```json
   [
     {
       "id": "550e8400-e29b-41d4-a716-446655440000",
       "user_id": "123e4567-e89b-12d3-a456-426614174000",
       "title": "Test todo",
       "description": "This is a test todo item",
       "is_completed": false,
       "created_at": "2026-02-07T12:00:00Z"
     }
   ]
   ```

**Step 5: Toggle Todo Completion**

1. Expand `PATCH /todos/{id}/complete`
2. Click "Try it out"
3. Enter the todo ID from Step 3 in the `id` field
4. Click "Execute"
5. Expected response (200 OK) with `is_completed: true`

**Step 6: Update a Todo**

1. Expand `PUT /todos/{id}`
2. Click "Try it out"
3. Enter the todo ID in the `id` field
4. Enter request body:
   ```json
   {
     "title": "Updated todo title",
     "description": "Updated description"
   }
   ```
5. Click "Execute"
6. Expected response (200 OK) with updated values

**Step 7: Delete a Todo**

1. Expand `DELETE /todos/{id}`
2. Click "Try it out"
3. Enter the todo ID in the `id` field
4. Click "Execute"
5. Expected response (204 No Content)

## Testing with cURL

### Create User Account

```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

Save the `access_token` from the response.

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

### Create Todo

```bash
curl -X POST http://localhost:8000/todos \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test todo","description":"Test description"}'
```

### List Todos

```bash
curl -X GET http://localhost:8000/todos \
  -H "Authorization: Bearer <your-token>"
```

### Get Single Todo

```bash
curl -X GET http://localhost:8000/todos/<todo-id> \
  -H "Authorization: Bearer <your-token>"
```

### Update Todo

```bash
curl -X PUT http://localhost:8000/todos/<todo-id> \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","description":"Updated description"}'
```

### Toggle Completion

```bash
curl -X PATCH http://localhost:8000/todos/<todo-id>/complete \
  -H "Authorization: Bearer <your-token>"
```

### Delete Todo

```bash
curl -X DELETE http://localhost:8000/todos/<todo-id> \
  -H "Authorization: Bearer <your-token>"
```

## Verification Steps

### 1. Verify Authentication

- ✓ POST /auth/signup creates user and returns JWT token
- ✓ POST /auth/signup with duplicate email returns 409 Conflict
- ✓ POST /auth/login with correct credentials returns JWT token
- ✓ POST /auth/login with wrong password returns 401 Unauthorized

### 2. Verify JWT Protection

- ✓ GET /todos without token returns 401 Unauthorized
- ✓ GET /todos with invalid token returns 401 Unauthorized
- ✓ GET /todos with valid token returns 200 OK

### 3. Verify Multi-Tenant Isolation

- ✓ Create two users (User A and User B)
- ✓ User A creates a todo
- ✓ User B cannot see User A's todo in GET /todos
- ✓ User B cannot access User A's todo via GET /todos/{id} (returns 404)
- ✓ User B cannot update User A's todo (returns 404)
- ✓ User B cannot delete User A's todo (returns 404)

### 4. Verify CRUD Operations

- ✓ POST /todos creates todo linked to authenticated user
- ✓ GET /todos returns only authenticated user's todos
- ✓ GET /todos/{id} returns todo if owned by user
- ✓ PUT /todos/{id} updates todo if owned by user
- ✓ DELETE /todos/{id} deletes todo if owned by user
- ✓ PATCH /todos/{id}/complete toggles completion status

### 5. Verify Validation

- ✓ POST /auth/signup with invalid email returns 422
- ✓ POST /auth/signup with short password returns 422
- ✓ POST /todos without title returns 422
- ✓ POST /todos with title > 255 chars returns 422

## Troubleshooting

### Server Won't Start

**Error**: `ModuleNotFoundError: No module named 'fastapi'`
- **Solution**: Install dependencies with `pip install -r requirements.txt`

**Error**: `Address already in use`
- **Solution**: Another process is using port 8000. Kill it or use a different port:
  ```bash
  uvicorn main:app --reload --port 8001
  ```

### Database Connection Errors

**Error**: `Database connection failed`
- **Solution**: Verify DATABASE_URL in .env is correct
- **Solution**: Run `python test_connection.py` to diagnose

### Authentication Errors

**Error**: `401 Unauthorized` on protected endpoints
- **Solution**: Verify you included "Bearer " before the token
- **Solution**: Check token hasn't expired (7 days)
- **Solution**: Verify JWT_SECRET in .env matches the one used to create the token

### CORS Errors (when testing from frontend)

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`
- **Solution**: Verify CORS_ORIGINS in .env includes your frontend URL
- **Solution**: Restart the FastAPI server after updating .env

## Next Steps

Once the backend is running successfully:

1. Test all endpoints via Swagger UI
2. Verify multi-tenant isolation with multiple users
3. Proceed with Sprint C: Frontend & Integration
4. Build Next.js frontend to consume these APIs
5. Integrate frontend authentication with JWT tokens

## Additional Resources

- FastAPI Documentation: https://fastapi.tiangolo.com/
- Swagger UI Guide: https://swagger.io/tools/swagger-ui/
- JWT.io Token Debugger: https://jwt.io/
- API Contracts: See `specs/002-fastapi-backend-auth/contracts/api-contracts.md`
