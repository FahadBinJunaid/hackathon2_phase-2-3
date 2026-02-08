from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


class Todo(SQLModel, table=True):
    """Todo model with multi-tenant isolation via user_id foreign key."""

    __tablename__ = "todos"
    __table_args__ = {"schema": "phase2"}

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(nullable=False, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    is_completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: uuid.UUID = Field(
        foreign_key="phase2.users.id",
        nullable=False,
        index=True
    )
