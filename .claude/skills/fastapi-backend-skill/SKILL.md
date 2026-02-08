---
name: fastapi-backend-skill
description: Build REST APIs with FastAPI. Use for creating endpoints, request validation, and error handling.
---

# FastAPI Backend Development

## Instructions

1. **API Structure**
   - Organize routes by feature (/api/tasks, /api/auth)
   - Use FastAPI routers for modular code
   - Return proper HTTP status codes

2. **Request/Response Models**
   - Use Pydantic models for validation
   - Define clear request and response schemas
   - Add field descriptions for documentation

3. **Error Handling**
   - Use HTTPException for API errors
   - Return helpful error messages
   - Log errors for debugging

4. **Async Operations**
   - Use async/await for database calls
   - Don't block the event loop
   - Handle timeouts properly

## Best Practices
- Enable CORS for frontend access
- Use dependency injection for auth
- Document endpoints with docstrings
- Validate all user inputs

## Example Routes

```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel

app = FastAPI()

class TaskCreate(BaseModel):
    title: str
    description: str = ""

class TaskResponse(BaseModel):
    id: int
    title: str
    completed: bool

@app.post("/api/{user_id}/tasks", response_model=TaskResponse)
async def create_task(
    user_id: str,
    task: TaskCreate,
    current_user: str = Depends(verify_token)
):
    if current_user != user_id:
        raise HTTPException(403, "Unauthorized")

    # Create task in database
    new_task = await create_task_in_db(user_id, task)
    return new_task
```