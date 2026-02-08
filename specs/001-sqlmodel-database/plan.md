# Implementation Plan: Phase 2 – Sprint A: Database & Models

**Branch**: `001-sqlmodel-database` | **Date**: 2026-02-07 | **Spec**: [specs/001-sqlmodel-database/spec.md](specs/001-sqlmodel-database/spec.md)
**Input**: Feature specification from `/specs/[001-sqlmodel-database]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build the database foundation for the full-stack Todo web app using SQLModel ORM and Neon PostgreSQL. Create User and Todo models with UUID primary keys and enforce multi-tenant isolation through user_id foreign key relationships. Establish proper database connections and initialize the phase2 schema to avoid conflicts with Phase 1.

## Technical Context

**Language/Version**: Python 3.13
**Primary Dependencies**: SQLModel, Neon PostgreSQL, asyncpg, python-dotenv
**Storage**: Neon PostgreSQL database with SQLModel ORM
**Testing**: pytest for unit and integration tests
**Target Platform**: Linux server environment
**Project Type**: Web application with backend database layer
**Performance Goals**: Async database operations, connection pooling for scalability
**Constraints**: All primary keys must be UUID format, multi-tenant isolation enforced, snake_case naming convention

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Spec-Driven Development (SDD) Compliance: Following /sp.specify → /sp.plan → /sp.tasks → /sp.implement workflow
- ✅ Layered Architecture Separation: Database layer being built separately from backend/frontend
- ✅ Multi-Tenant Data Isolation: User_id foreign key will enforce data isolation between users
- ✅ Agent-Based Development: Using database-agent for models and backend-agent for setup
- ✅ Free-Tier Friendly Infrastructure: Using Neon PostgreSQL free tier
- ✅ AI-Ready Architecture: Clean, structured data models that support future AI features

## Project Structure

### Documentation (this feature)

```text
specs/001-sqlmodel-database/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── .env
├── requirements.txt
├── db.py
├── init_db.py
├── test_connection.py
└── models/
    ├── user.py
    └── todo.py

tests/
├── unit/
└── integration/
```

**Structure Decision**: Web application with dedicated backend folder containing database models, connection setup, and initialization scripts. Models are organized in a dedicated subdirectory for clear separation of concerns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

## Implementation Deviations

**Date**: 2026-02-07

### Database URL Format
- **Original Plan**: `sslmode=require&channel_binding=require`
- **Implemented**: `ssl=require`
- **Reason**: asyncpg driver uses different SSL parameter syntax than psycopg2. The `sslmode` and `channel_binding` parameters are not supported by asyncpg.

### Database URL Driver Specification
- **Addition**: Added automatic conversion in db.py to change `postgresql://` to `postgresql+asyncpg://`
- **Reason**: SQLAlchemy async engine requires explicit driver specification. This conversion ensures the async driver is used without requiring manual URL modification in .env file.

### Impact
- No architectural changes
- All functional requirements met
- Database connection and models work as specified
- Multi-tenant isolation enforced correctly