# Database API Contracts: Phase 2 – Sprint A: Database & Models

## Overview
This document defines the database layer contracts for the Phase 2 Todo application. These contracts outline the expected behavior of the database operations that will support the backend API layer.

## Core Entities

### User Entity Contract
- **Entity Name**: User
- **Primary Key**: UUID (generated via uuid4)
- **Required Fields**: email (unique), hashed_password
- **Constraints**:
  - email must be unique across all users
  - email and hashed_password are required (not nullable)
- **Schema**: phase2.users

### Todo Entity Contract
- **Entity Name**: Todo
- **Primary Key**: UUID (generated via uuid4)
- **Required Fields**: title, user_id
- **Optional Fields**: description
- **Default Values**:
  - is_completed: False
  - created_at: current timestamp
- **Constraints**:
  - user_id must reference a valid User
  - user_id is required (not nullable)
  - title is required (not nullable)
- **Schema**: phase2.todos

## Multi-Tenancy Contract
- **Requirement**: Every Todo must belong to a specific user
- **Enforcement**: Foreign key constraint from todos.user_id to users.id
- **Access Rule**: Applications must filter queries by user_id to maintain data isolation
- **Validation**: Database-level foreign key constraint prevents orphaned todos

## Database Connection Contract
- **Protocol**: PostgreSQL wire protocol
- **Connection Type**: Async
- **URL Format**: Standard PostgreSQL connection string
- **Authentication**: Standard PostgreSQL authentication
- **SSL**: Required (sslmode=require)

## Schema Isolation Contract
- **Schema Name**: phase2
- **Purpose**: Isolate Phase 2 data from Phase 1
- **Creation**: Schema must be created if it doesn't exist
- **Permissions**: Application user must have CREATE and USAGE on phase2 schema

## Error Handling Contract
- **Connection Failures**: Must raise appropriate database connection exceptions
- **Constraint Violations**: Must raise integrity constraint violation exceptions
- **Data Validation**: Must raise appropriate validation errors for invalid data
- **Timeouts**: Must raise timeout exceptions for operations exceeding limits

## Performance Contract
- **Indexing**:
  - users.email: unique index for login operations
  - todos.user_id: index for user-based queries
  - todos.created_at: index for chronological sorting
- **Query Performance**: All user-filtered queries should leverage indexes
- **Connection Pooling**: Implementation should support connection pooling

## Transaction Contract
- **ACID Compliance**: All operations must maintain ACID properties
- **Isolation Level**: Default PostgreSQL isolation level
- **Rollback Capability**: All operations must support rollback on failure
- **Concurrency**: Support for concurrent access with proper locking