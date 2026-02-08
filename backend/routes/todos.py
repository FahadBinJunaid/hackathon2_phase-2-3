from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
import uuid

from auth import get_current_user
from db import get_async_session
from models.user import User
from models.todo import Todo
from schemas.todo import TodoCreate, TodoRead, TodoUpdate

router = APIRouter(prefix="/todos", tags=["Todos"])


@router.post("", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
async def create_todo(
    todo_data: TodoCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
) -> TodoRead:
    """
    Create a new todo item for the authenticated user.

    Args:
        todo_data: Todo creation data (title and optional description)
        current_user: Authenticated user from JWT token
        session: Database session

    Returns:
        Created todo with all fields

    Raises:
        HTTPException 401: Missing or invalid authentication
        HTTPException 422: Missing title or validation error
    """
    # Create new todo linked to authenticated user
    new_todo = Todo(
        title=todo_data.title,
        description=todo_data.description,
        user_id=current_user.id
    )

    session.add(new_todo)
    await session.commit()
    await session.refresh(new_todo)

    return TodoRead.model_validate(new_todo)


@router.get("", response_model=List[TodoRead], status_code=status.HTTP_200_OK)
async def get_todos(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
) -> List[TodoRead]:
    """
    Retrieve all todos for the authenticated user.

    Args:
        current_user: Authenticated user from JWT token
        session: Database session

    Returns:
        List of todos owned by the authenticated user

    Raises:
        HTTPException 401: Missing or invalid authentication
    """
    # Query todos filtered by authenticated user's user_id
    statement = select(Todo).where(Todo.user_id == current_user.id)
    result = await session.exec(statement)
    todos = result.all()

    return [TodoRead.model_validate(todo) for todo in todos]


@router.get("/{todo_id}", response_model=TodoRead, status_code=status.HTTP_200_OK)
async def get_todo(
    todo_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
) -> TodoRead:
    """
    Retrieve a specific todo by ID. User must own the todo.

    Args:
        todo_id: Todo identifier
        current_user: Authenticated user from JWT token
        session: Database session

    Returns:
        Todo data if found and owned by user

    Raises:
        HTTPException 401: Missing or invalid authentication
        HTTPException 404: Todo doesn't exist or user doesn't own it
    """
    # Query todo by ID
    statement = select(Todo).where(Todo.id == todo_id)
    result = await session.exec(statement)
    todo = result.first()

    # Verify todo exists and user owns it
    if not todo or todo.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return TodoRead.model_validate(todo)


@router.put("/{todo_id}", response_model=TodoRead, status_code=status.HTTP_200_OK)
async def update_todo(
    todo_id: uuid.UUID,
    todo_data: TodoUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
) -> TodoRead:
    """
    Update a todo's title and/or description. User must own the todo.

    Args:
        todo_id: Todo identifier
        todo_data: Updated todo data (title and/or description)
        current_user: Authenticated user from JWT token
        session: Database session

    Returns:
        Updated todo data

    Raises:
        HTTPException 401: Missing or invalid authentication
        HTTPException 404: Todo doesn't exist or user doesn't own it
        HTTPException 422: Validation error
    """
    # Query todo by ID
    statement = select(Todo).where(Todo.id == todo_id)
    result = await session.exec(statement)
    todo = result.first()

    # Verify todo exists and user owns it
    if not todo or todo.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    # Update fields if provided
    if todo_data.title is not None:
        todo.title = todo_data.title
    if todo_data.description is not None:
        todo.description = todo_data.description

    session.add(todo)
    await session.commit()
    await session.refresh(todo)

    return TodoRead.model_validate(todo)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(
    todo_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
) -> None:
    """
    Delete a todo. User must own the todo.

    Args:
        todo_id: Todo identifier
        current_user: Authenticated user from JWT token
        session: Database session

    Returns:
        No content on success

    Raises:
        HTTPException 401: Missing or invalid authentication
        HTTPException 404: Todo doesn't exist or user doesn't own it
    """
    # Query todo by ID
    statement = select(Todo).where(Todo.id == todo_id)
    result = await session.exec(statement)
    todo = result.first()

    # Verify todo exists and user owns it
    if not todo or todo.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    await session.delete(todo)
    await session.commit()


@router.patch("/{todo_id}/complete", response_model=TodoRead, status_code=status.HTTP_200_OK)
async def toggle_todo_completion(
    todo_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
) -> TodoRead:
    """
    Toggle the completion status of a todo. User must own the todo.

    Args:
        todo_id: Todo identifier
        current_user: Authenticated user from JWT token
        session: Database session

    Returns:
        Updated todo with toggled completion status

    Raises:
        HTTPException 401: Missing or invalid authentication
        HTTPException 404: Todo doesn't exist or user doesn't own it
    """
    # Query todo by ID
    statement = select(Todo).where(Todo.id == todo_id)
    result = await session.exec(statement)
    todo = result.first()

    # Verify todo exists and user owns it
    if not todo or todo.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    # Toggle completion status
    todo.is_completed = not todo.is_completed

    session.add(todo)
    await session.commit()
    await session.refresh(todo)

    return TodoRead.model_validate(todo)
