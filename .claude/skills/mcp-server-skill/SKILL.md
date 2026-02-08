---
name: mcp-server-skill
description: Create MCP servers that expose tools to AI agents. Use for building stateless, database-backed tools.
---

# MCP Server Development

## Instructions

1. **Tool Creation**
   - Define tool with clear name and description
   - Specify parameters with proper types
   - Return structured JSON responses

2. **Stateless Design**
   - Don't store state in memory
   - All data must come from/go to database
   - Each tool call is independent

3. **Database Integration**
   - Connect to Neon DB in each tool
   - Use async operations for performance
   - Close connections properly

4. **Error Handling**
   - Catch all database errors
   - Return error status in response
   - Provide helpful error messages

## Best Practices
- Keep tools focused (single responsibility)
- Validate all inputs
- Return consistent response format
- Document tool behavior clearly

## Example Tool Implementation

```python
from mcp.server import MCPServer
from sqlmodel import select, AsyncSession

server = MCPServer()

@server.tool()
async def add_task(user_id: str, title: str, description: str = ""):
    """
    Create a new task for the user

    Args:
        user_id: The user's unique identifier
        title: Task title (required, max 200 chars)
        description: Optional task description

    Returns:
        {
            "task_id": int,
            "status": "created" | "error",
            "title": str,
            "message": str (optional error message)
        }
    """
    try:
        async with AsyncSession(engine) as session:
            task = Task(
                user_id=user_id,
                title=title[:200],  # Enforce max length
                description=description
            )
            session.add(task)
            await session.commit()
            await session.refresh(task)

            return {
                "task_id": task.id,
                "status": "created",
                "title": task.title
            }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to create task: {str(e)}"
        }

@server.tool()
async def list_tasks(user_id: str, status: str = "all"):
    """Get all tasks for a user, optionally filtered by completion status"""
    try:
        async with AsyncSession(engine) as session:
            statement = select(Task).where(Task.user_id == user_id)

            if status == "pending":
                statement = statement.where(Task.completed == False)
            elif status == "completed":
                statement = statement.where(Task.completed == True)

            results = await session.exec(statement)
            tasks = results.all()

            return {
                "status": "success",
                "tasks": [
                    {
                        "id": task.id,
                        "title": task.title,
                        "completed": task.completed,
                        "created_at": task.created_at.isoformat()
                    }
                    for task in tasks
                ]
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
```