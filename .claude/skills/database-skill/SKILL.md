---
name: database-skill
description: Manage Neon Serverless PostgreSQL with SQLModel ORM. Use for creating tables, migrations, and CRUD operations.
---

# Database Operations with SQLModel

## Instructions

1. **Database Connection**
   - Get connection string from Neon dashboard
   - Store in DATABASE_URL environment variable
   - Create engine with SQLModel

2. **Model Definition**
   - Use SQLModel for type-safe models
   - Define fields with proper types
   - Add relationships with foreign keys
   - Create indexes for frequently queried fields

3. **Migrations**
   - Use SQLModel.metadata.create_all() for initial setup
   - Document schema changes
   - Test migrations on dev database first

4. **CRUD Operations**
   - Use async sessions for better performance
   - Handle database errors gracefully
   - Close sessions properly

## Best Practices
- Always use query parameters (prevent SQL injection)
- Create indexes on foreign keys
- Use transactions for multi-step operations
- Implement proper error handling

## Example Models

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=200)
    description: str = Field(default="")
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## Example Queries

```python
# Create
async with AsyncSession(engine) as session:
    task = Task(user_id=user_id, title="Buy groceries")
    session.add(task)
    await session.commit()

# Read
statement = select(Task).where(Task.user_id == user_id)
results = await session.exec(statement)
tasks = results.all()

# Update
task.completed = True
session.add(task)
await session.commit()

# Delete
await session.delete(task)
await session.commit()
```