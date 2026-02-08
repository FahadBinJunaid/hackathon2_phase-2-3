---
name: auth-skill
description: Implement user authentication with Better Auth and JWT tokens. Use for signup, signin, password hashing, and token management.
---

# Authentication Implementation

## Instructions

1. **Better Auth Setup**
   - Install Better Auth package
   - Configure JWT secret in environment variables
   - Set up auth endpoints (/api/auth/signin, /api/auth/signup)

2. **JWT Token Management**
   - Generate JWT on successful login
   - Include user ID and email in token payload
   - Set token expiration (7 days default)
   - Return token to client

3. **Password Security**
   - Hash passwords with bcrypt (10 salt rounds)
   - Never store plain text passwords
   - Validate password strength (min 8 chars)

4. **Middleware Protection**
   - Verify JWT on protected routes
   - Extract user ID from token
   - Return 401 for invalid/expired tokens

## Best Practices
- Store JWT secret in environment variable
- Use HTTPS in production
- Implement refresh tokens for long sessions
- Log authentication attempts

## Example Code Structure

**Backend (FastAPI):**
```python
from fastapi import HTTPException, Header
import jwt

def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401, "No token provided")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except:
        raise HTTPException(401, "Invalid token")
```

**Frontend (Next.js):**
```typescript
// Store token
localStorage.setItem('token', response.token);

// Add to requests
headers: {
  'Authorization': `Bearer ${token}`
}
```