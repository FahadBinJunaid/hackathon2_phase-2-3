from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from auth import hash_password, verify_password, create_access_token
from db import get_async_session
from models.user import User
from schemas.auth import SignupRequest, LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    signup_data: SignupRequest,
    session: AsyncSession = Depends(get_async_session)
) -> TokenResponse:
    """
    Create a new user account and return an access token.

    Args:
        signup_data: User signup credentials (email and password)
        session: Database session

    Returns:
        TokenResponse with JWT access token

    Raises:
        HTTPException 409: Email already registered
        HTTPException 422: Validation error (invalid email or password too short)
    """
    # Check if email already exists
    statement = select(User).where(User.email == signup_data.email)
    result = await session.exec(statement)
    existing_user = result.first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Hash password with bcrypt (10 rounds)
    hashed_password = hash_password(signup_data.password)

    # Create new user
    new_user = User(
        email=signup_data.email,
        hashed_password=hashed_password
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    # Generate JWT token
    access_token = create_access_token(user_id=new_user.id, email=new_user.email)

    return TokenResponse(access_token=access_token, token_type="bearer")


@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def login(
    login_data: LoginRequest,
    session: AsyncSession = Depends(get_async_session)
) -> TokenResponse:
    """
    Authenticate with existing credentials and return an access token.

    Args:
        login_data: User login credentials (email and password)
        session: Database session

    Returns:
        TokenResponse with JWT access token

    Raises:
        HTTPException 401: Invalid email or password
        HTTPException 422: Validation error (invalid email format)
    """
    # Query user by email
    statement = select(User).where(User.email == login_data.email)
    result = await session.exec(statement)
    user = result.first()

    # Verify user exists and password is correct
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate JWT token
    access_token = create_access_token(user_id=user.id, email=user.email)

    return TokenResponse(access_token=access_token, token_type="bearer")
