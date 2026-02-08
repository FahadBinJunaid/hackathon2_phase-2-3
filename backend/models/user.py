from sqlmodel import SQLModel, Field
from typing import Optional
import uuid


class User(SQLModel, table=True):
    """User model for authentication and todo ownership."""

    __tablename__ = "users"
    __table_args__ = {"schema": "phase2"}

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, nullable=False, max_length=255, index=True)
    hashed_password: str = Field(nullable=False, max_length=255)
