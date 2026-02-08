# Research: Phase 2 – Sprint B: Backend Engine & Auth

**Feature**: 002-fastapi-backend-auth
**Date**: 2026-02-07
**Research Lead**: Claude

## Executive Summary

This research document addresses the technical decisions required for implementing a secure FastAPI backend with JWT authentication and multi-tenant CRUD APIs. It covers framework selection, authentication strategies, password security, and API design patterns.

## Decision: FastAPI for Async Web Framework

**Rationale**: FastAPI is the optimal choice for this backend implementation due to its native async/await support, automatic OpenAPI documentation generation, built-in Pydantic validation, and dependency injection system. These features directly address the requirements for high-performance endpoints, API documentation, request validation, and JWT middleware.

**Alternatives considered**:
- Flask: Mature ecosystem but lacks native async support and automatic API documentation. Would require additional libraries (Flask-RESTX, marshmallow) for features FastAPI provides out-of-the-box.
- Django REST Framework: Comprehensive but heavyweight. Includes its own ORM which conflicts with existing SQLModel setup. Overkill for this use case.
- Starlette: Lower-level ASGI framework that FastAPI is built on. Would require manual implementation of OpenAPI docs, validation, and dependency injection.

**Performance characteristics**: FastAPI benchmarks show ~60,000 requests/second on standard hardware, well exceeding the 100 concurrent user requirement.

## Decision: JWT (JSON Web Tokens) for Stateless Authentication

**Rationale**: JWT provides stateless authentication, eliminating the need for session storage infrastructure. Tokens are self-contained with user identity and expiration, enabling horizontal scaling. Compatible with Better Auth patterns for future frontend integration. 7-day expiration balances security (limits exposure window) with user convenience (reduces login frequency).

**Alternatives considered**:
- Session-based authentication: Requires session storage (Redis, database, or in-memory). Adds infrastructure complexity and creates scaling bottlenecks. Not suitable for stateless API design.
- OAuth2 with refresh tokens: More complex implementation requiring refresh token storage and rotation logic. Appropriate for future enhancement but unnecessary for MVP.
- API keys: Simpler but less secure (no expiration, harder to rotate). Not suitable for user-facing authentication.

**Token structure**:
```json
{
  "user_id": "uuid-string",
  "email": "user@example.com",
  "exp": 1234567890
}
```

**Security considerations**: HS256 algorithm with 256-bit secret. Tokens cannot be revoked before expiration without additional infrastructure (acceptable trade-off for MVP with 7-day expiration).

## Decision: Bcrypt for Password Hashing

**Rationale**: Bcrypt is the industry-standard password hashing algorithm with built-in salting and configurable work factor. The 10-round work factor provides strong security against brute-force attacks while maintaining acceptable performance (~100-200ms per hash). Well-supported by passlib library with extensive testing and security audits.

**Alternatives considered**:
- Argon2: Winner of Password Hashing Competition (2015), more resistant to GPU attacks. However, less widely adopted and requires additional C dependencies. Good candidate for future upgrade.
- PBKDF2: Older standard (NIST approved) but more vulnerable to GPU-based attacks than bcrypt. Not recommended for new implementations.
- Scrypt: Good security properties but higher memory requirements can cause issues in constrained environments.

**Work factor analysis**:
- 10 rounds: ~100-200ms (chosen for balance)
- 12 rounds: ~400-500ms (too slow for user experience)
- 8 rounds: ~50ms (insufficient security margin)

## Decision: Dependency Injection for Authentication Middleware

**Rationale**: FastAPI's Depends() system provides clean, reusable authentication logic. The get_current_user dependency extracts and validates JWT tokens, returning the authenticated user object. This pattern enables:
- Type-safe authentication across all endpoints
- Easy testing with dependency overrides
- Clear separation of concerns
- Automatic OpenAPI documentation of security requirements

**Implementation pattern**:
```python
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # Decode and validate JWT
    # Query user from database
    # Return user object
```

**Alternatives considered**:
- Middleware-based authentication: Runs on every request, harder to exclude specific endpoints (like /auth/signup). Less flexible than dependency injection.
- Decorator-based authentication: Not idiomatic for FastAPI, loses type safety and automatic documentation.
- Manual token validation in each endpoint: Code duplication, error-prone, harder to maintain.

## Decision: Pydantic Schemas for Request/Response Validation

**Rationale**: Pydantic provides automatic validation, serialization, and documentation of request/response data. FastAPI integrates natively with Pydantic, generating OpenAPI schemas automatically. Type hints enable IDE autocomplete and catch errors at development time.

**Schema design principles**:
- Separate schemas for create/read/update operations
- Use EmailStr for email validation
- Use Optional[] for nullable fields
- Exclude sensitive fields (hashed_password) from response schemas

**Alternatives considered**:
- Marshmallow: Popular serialization library but requires manual integration with FastAPI. Pydantic is the native choice.
- Dataclasses: Python standard library but lacks validation and serialization features.
- Manual validation: Error-prone, no automatic documentation, significant development overhead.

## Decision: CORS Configuration via Environment Variables

**Rationale**: Cross-Origin Resource Sharing (CORS) must be configured to allow frontend (Next.js on localhost:3000) to access backend APIs. Environment variable configuration enables different settings for development, staging, and production without code changes.

**Configuration approach**:
```python
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

**Security considerations**: Restrict origins to known domains. Never use wildcard (*) in production. Validate origin format to prevent header injection attacks.

## Best Practices: Multi-Tenant Data Isolation

**Research Finding**: Multi-tenant isolation must be enforced at multiple layers:

1. **Database Layer**: Foreign key constraints ensure todos link to valid users
2. **Application Layer**: All queries filter by user_id from JWT token
3. **API Layer**: Ownership verification before any update/delete operation

**Implementation pattern**:
```python
# Extract user_id from JWT
current_user = Depends(get_current_user)

# Filter query by user_id
todos = await session.exec(
    select(Todo).where(Todo.user_id == current_user.id)
)

# Verify ownership before update/delete
if todo.user_id != current_user.id:
    raise HTTPException(status_code=403)
```

**Testing requirements**: Integration tests must verify User A cannot access User B's data through any endpoint or query parameter manipulation.

## Best Practices: Error Response Standardization

**Research Finding**: Consistent error responses improve API usability and debugging. FastAPI provides exception handlers for standard HTTP errors.

**Error response structure**:
```json
{
  "detail": "Human-readable error message"
}
```

**Status code mapping**:
- 400 Bad Request: Malformed request syntax
- 401 Unauthorized: Missing or invalid authentication
- 403 Forbidden: Valid authentication but insufficient permissions
- 404 Not Found: Resource doesn't exist
- 409 Conflict: Resource already exists (duplicate email)
- 422 Unprocessable Entity: Validation errors (Pydantic)
- 500 Internal Server Error: Unexpected server errors

## Best Practices: Async Database Sessions

**Research Finding**: FastAPI async endpoints require async database sessions. SQLModel supports async operations via SQLAlchemy's AsyncSession.

**Session management pattern**:
```python
async def get_session():
    async with async_session() as session:
        yield session

# Use in endpoints
async def create_todo(
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Database operations
```

**Connection pooling**: AsyncEngine manages connection pool automatically. Default pool size (5) sufficient for development, tune for production based on load testing.

## Technical Unknowns Resolved

1. **JWT Library Selection**: python-jose chosen over PyJWT for better cryptography support and FastAPI ecosystem compatibility
2. **Password Validation**: Minimum 8 characters enforced at API level via Pydantic validator
3. **Token Expiration Handling**: FastAPI raises HTTPException(401) automatically when token validation fails
4. **CORS Preflight**: FastAPI CORS middleware handles OPTIONS requests automatically
5. **OpenAPI Documentation**: FastAPI generates Swagger UI at /docs and ReDoc at /redoc automatically
6. **Async Session Lifecycle**: Use dependency injection with yield to ensure proper session cleanup

## Performance Considerations

**Bcrypt Performance**: 10 rounds adds ~100-200ms to signup/login. Acceptable for authentication use case. Consider caching user lookups if performance becomes issue.

**Database Query Optimization**: Index on todos.user_id (already exists from Sprint A) ensures fast filtering. No additional indexes needed for MVP.

**Concurrent Request Handling**: Uvicorn with default workers (1) sufficient for development. Production deployment should use multiple workers based on CPU cores.

## Security Considerations

**JWT Secret Management**:
- Generate strong random secret (32+ characters)
- Store in .env file
- Never commit to version control
- Rotate periodically (requires re-authentication of all users)

**Password Security**:
- Never log passwords
- Never return hashed_password in API responses
- Use HTTPS in production to protect credentials in transit
- Consider adding password complexity requirements in future

**SQL Injection Prevention**: SQLModel uses parameterized queries automatically. No additional protection needed.

**CORS Security**: Restrict origins to known domains. Validate origin format to prevent header injection.
