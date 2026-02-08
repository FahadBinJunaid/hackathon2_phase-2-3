# Quickstart Guide: Phase 2 – Sprint A: Database & Models

**Feature**: 001-sqlmodel-database
**Date**: 2026-02-07

## Overview

This quickstart guide provides the essential steps to set up and run the database foundation for the Phase 2 Todo application. This includes configuring the Neon PostgreSQL connection, creating the required models, and initializing the database schema.

## Prerequisites

- Python 3.13 or higher
- Access to Neon PostgreSQL database
- pip package manager
- Virtual environment (recommended)

## Setup Instructions

### 1. Clone and Navigate to Project

```bash
git clone <repository-url>
cd phase-2
```

### 2. Set Up Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install sqlmodel asyncpg python-dotenv
```

### 4. Configure Environment Variables

Create a `.env` file in the backend/ directory with the following content:

```env
DATABASE_URL=postgresql://neondb_owner:npg_Xw3QpPnSF1LN@ep-delicate-credit-ait8yp8b-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=<generate-a-random-32-character-string-here>
```

### 5. Create Backend Directory Structure

```bash
mkdir -p backend/models
```

## File Structure

Create the following files in the backend/ directory:

### 5.1 Database Connection (backend/db.py)

```python
import os
import uuid
from sqlmodel import create_engine, Session
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create async engine
async_engine = create_async_engine(DATABASE_URL)

def get_async_session():
    async with AsyncSession(async_engine) as session:
        yield session
```

### 5.2 User Model (backend/models/user.py)

```python
from sqlmodel import SQLModel, Field
from typing import Optional
import uuid

class User(SQLModel, table=True):
    __tablename__ = "users"
    __table_args__ = {"schema": "phase2"}

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, nullable=False, max_length=255)
    hashed_password: str = Field(nullable=False, max_length=255)
```

### 5.3 Todo Model (backend/models/todo.py)

```python
from sqlmodel import SQLModel, Field
from typing import Optional
import uuid
from datetime import datetime

class Todo(SQLModel, table=True):
    __tablename__ = "todos"
    __table_args__ = {"schema": "phase2"}

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(nullable=False, max_length=255)
    description: Optional[str] = Field(max_length=1000)
    is_completed: bool = Field(default=False)
    created_at: datetime = Field(default=datetime.utcnow())
    user_id: uuid.UUID = Field(foreign_key="phase2.users.id", nullable=False, index=True)
```

### 5.4 Database Initialization (backend/init_db.py)

```python
import asyncio
from sqlmodel import SQLModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.schema import CreateTable
from db import async_engine
from models.user import User
from models.todo import Todo

async def create_tables():
    async with async_engine.begin() as conn:
        # Create schema if it doesn't exist
        await conn.execute("CREATE SCHEMA IF NOT EXISTS phase2")

        # Create tables
        await conn.run_sync(SQLModel.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(create_tables())
```

### 5.5 Connection Test (backend/test_connection.py)

```python
import asyncio
from sqlmodel import select
from db import async_engine
from models.user import User

async def test_connection():
    try:
        async with async_engine.begin() as conn:
            # Test basic connection by executing a simple query
            result = await conn.execute(select(User).limit(1))
            print("Database connection successful!")
            return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_connection())
```

## Running the Setup

### Initialize the Database

```bash
cd backend
python init_db.py
```

### Test the Connection

```bash
cd backend
python test_connection.py
```

## Verification Steps

1. Confirm that the `phase2` schema exists in your Neon PostgreSQL database
2. Verify that the `users` and `todos` tables were created in the `phase2` schema
3. Check that all required indexes are in place
4. Test that the database connection works properly

## Troubleshooting

### Common Issues

- **Connection Error**: Verify DATABASE_URL in .env file is correct
- **Schema Creation Error**: Ensure user has CREATE SCHEMA permissions
- **UUID Type Error**: Make sure your PostgreSQL version supports UUID type
- **Foreign Key Error**: Verify the User table is created before the Todo table

### Required Permissions

Your Neon PostgreSQL user needs the following permissions:
- CONNECT to the database
- CREATE on the database (for schema creation)
- USAGE on the phase2 schema
- CREATE on the phase2 schema

## Next Steps

Once the database foundation is set up successfully:
1. Proceed with creating API endpoints to interact with these models
2. Implement authentication and authorization logic
3. Build the frontend to connect to the backend APIs