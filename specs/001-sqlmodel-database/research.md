# Research: Phase 2 – Sprint A: Database & Models

**Feature**: 001-sqlmodel-database
**Date**: 2026-02-07
**Research Lead**: Claude

## Executive Summary

This research document addresses the technical decisions required for implementing the database foundation using SQLModel ORM and Neon PostgreSQL. It covers best practices for UUID primary keys, multi-tenant isolation patterns, async database connections, and schema management.

## Decision: SQLModel with Neon PostgreSQL for Database Layer

**Rationale**: SQLModel is the ideal choice for this project as it combines the power of SQLAlchemy with the flexibility of Pydantic, providing type safety and validation out of the box. Neon PostgreSQL offers serverless scaling and is free-tier friendly, aligning with the project's infrastructure requirements.

**Alternatives considered**:
- Peewee ORM: Less mature than SQLAlchemy, limited async support
- Tortoise ORM: Good async support but lacks SQLModel's Pydantic integration
- Raw asyncpg: Too low-level, requires more boilerplate code
- SQLAlchemy Core + Pydantic: Would require manual integration vs SQLModel's built-in support

## Decision: UUID Primary Keys with uuid4

**Rationale**: UUIDs provide globally unique identifiers without coordination, which is essential for multi-tenant applications. They prevent ID guessing attacks and provide better security. The uuid4 variant ensures randomness preventing predictability.

**Alternatives considered**:
- Auto-increment integers: Vulnerable to ID enumeration attacks, difficult to merge datasets
- Sequential UUIDs: More complex to implement, lose some benefits of random distribution
- Custom string IDs: Would require additional validation and generation logic

## Decision: Multi-Tenant Isolation via user_id Foreign Key

**Rationale**: Enforcing multi-tenant isolation at the application level through user_id foreign keys provides a robust security boundary. Combined with database constraints, this ensures data isolation between users while maintaining query performance through proper indexing.

**Alternatives considered**:
- Separate databases per user: Excessive overhead, difficult to manage
- Row-level security: More complex to implement and maintain
- Application-only validation: Could be bypassed by direct database access

## Decision: Separate phase2 Schema for Isolation

**Rationale**: Using a dedicated schema prevents conflicts with Phase 1 implementations and provides clear separation of concerns. This approach allows for easier migration and rollback strategies.

**Alternatives considered**:
- Table prefixes: Still share the same schema space, potential for conflicts
- Same schema with naming conventions: Less robust than proper schema separation
- Separate database: Overly complex for this use case

## Decision: Async Database Connections with Connection Pooling

**Rationale**: Async connections are essential for handling concurrent requests efficiently in a web application. Connection pooling reduces overhead and improves performance by reusing database connections.

**Alternatives considered**:
- Synchronous connections: Would block threads and reduce performance
- No connection pooling: Would create excessive overhead from opening/closing connections
- Fixed-size connection pool: Less flexible than adaptive approaches

## Best Practices: Environment Configuration Management

**Research Finding**: Using python-dotenv for environment variable management is the standard practice for Python applications. Storing sensitive data like DATABASE_URL and JWT_SECRET in environment variables keeps them out of source control and allows for easy configuration across different environments.

**Implementation Pattern**:
- Generate .env file with required variables
- Include .env in .gitignore to prevent committing secrets
- Use strong random generation for JWT_SECRET (32+ characters)

## Best Practices: SQLModel Model Patterns

**Research Finding**: SQLModel models should inherit from SQLModel with table=True to create database tables. Use Field() for column specifications including constraints like unique=True, nullable=False, and foreign_key relationships.

**Key Patterns**:
- Use UUID type for primary keys with default_factory=uuid.uuid4
- Apply unique constraints on email fields
- Use indexed=True for foreign keys to improve query performance
- Define table_args to specify schema name

## Best Practices: Database Initialization and Migration

**Research Finding**: For initial setup, SQLModel.metadata.create_all() can be used to create tables. However, for production environments, proper migration tools like Alembic should be implemented later. For this phase, direct creation is acceptable.

**Considerations**:
- Use async context managers for database connections
- Implement proper error handling for connection failures
- Validate schema creation before proceeding with application startup

## Technical Unknowns Resolved

1. **UUID Generation**: Python's uuid module with uuid4() function provides cryptographically secure random UUIDs
2. **Neon PostgreSQL Connection**: Use asyncpg for async connections with proper connection string format
3. **Schema Creation**: Execute "CREATE SCHEMA IF NOT EXISTS phase2" before creating tables
4. **Foreign Key Constraints**: SQLModel supports ForeignKey() for defining relationships between models
5. **Connection Pooling**: Use SQLModel's async engine with connection pooling parameters