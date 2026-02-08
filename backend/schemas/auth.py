from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    """Request schema for user signup."""

    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, description="Password with minimum 8 characters")


class LoginRequest(BaseModel):
    """Request schema for user login."""

    email: EmailStr = Field(..., description="Registered email address")
    password: str = Field(..., description="User's password")


class TokenResponse(BaseModel):
    """Response schema for authentication tokens."""

    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type (always 'bearer')")
