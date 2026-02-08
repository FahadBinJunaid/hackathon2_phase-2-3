from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class TodoCreate(BaseModel):
    """Request schema for creating a new todo."""

    title: str = Field(..., max_length=255, description="Todo title")
    description: Optional[str] = Field(None, max_length=1000, description="Todo description")


class TodoUpdate(BaseModel):
    """Request schema for updating a todo."""

    title: Optional[str] = Field(None, max_length=255, description="New title")
    description: Optional[str] = Field(None, max_length=1000, description="New description")


class TodoRead(BaseModel):
    """Response schema for todo data."""

    id: uuid.UUID = Field(..., description="Todo identifier")
    user_id: uuid.UUID = Field(..., description="Owner user identifier")
    title: str = Field(..., description="Todo title")
    description: Optional[str] = Field(None, description="Todo description")
    is_completed: bool = Field(..., description="Completion status")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        from_attributes = True
