<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Modified principles: All principles were replaced with Phase 2 specific principles
- Added sections: Specific constraints and workflow sections for Phase 2
- Removed sections: None
- Templates requiring updates: ✅ plan-template.md updated to reflect new principles, ✅ spec-template.md updated to reflect new constraints, ✅ tasks-template.md updated to reflect new workflow
- Follow-up TODOs: None
-->

# Phase 2 – Full-Stack AI-Ready Todo Web Application Constitution

## Core Principles

### I. Spec-Driven Development (SDD) Compliance
All feature development must follow the Spec-Driven Development methodology: /sp.specify → /sp.plan → /sp.tasks → /sp.implement. No manual coding outside this workflow is permitted. This ensures traceability, testability, and alignment with user requirements.

### II. Layered Architecture Separation
Maintain strict separation between database, backend, and frontend layers. Each layer must be independently developable, testable, and deployable. Database changes must not directly impact frontend code without proper API mediation.

### III. Multi-Tenant Data Isolation (NON-NEGOTIABLE)
Every user's data must be strictly isolated from other users. Every Todo must be linked to a user_id. No user can access another user's data under any circumstances. This principle must be enforced at all layers: database, backend, and frontend.

### IV. Agent-Based Development
Use specialized agents from .claude/agents for all development tasks. Each agent has specific responsibilities: database-agent for schema, backend-agent for APIs, auth-agent for security, frontend-agent for UI. Agents must validate dependent components before integration.

### V. Free-Tier Friendly Infrastructure
All infrastructure choices must be compatible with free or free-tier services wherever possible. This ensures accessibility for all developers and avoids unnecessary costs during development and initial deployment phases.

### VI. AI-Ready Architecture
Design all components with AI integration in mind. APIs, data structures, and workflows must support future AI features. Maintain clean, structured data and well-documented interfaces to enable AI agent interactions.

## Technology Stack Requirements

### Backend Requirements
- Python 3.13 with FastAPI for web framework
- SQLModel for ORM and database modeling
- PostgreSQL database using Neon for cloud hosting
- JWT tokens for authentication
- Secure password hashing with bcrypt

### Frontend Requirements
- Next.js 16 with App Router for frontend framework
- Tailwind CSS for styling
- Clean, component-based architecture
- Responsive design principles

### Naming Conventions
- Backend: snake_case for all variables, functions, and database fields
- Frontend: PascalCase for components and camelCase for variables/functions
- Database: lowercase with underscores for table and column names

## Development Workflow

### Mandatory Process Flow
All development must follow the spec loop: /sp.specify → /sp.plan → /sp.tasks → /sp.implement. No manual coding outside this workflow. Each phase must be completed before proceeding to the next.

### Quality Gates
- All code must pass automated testing before merging
- Database schema changes must be validated by database-agent
- Authentication must be secured by auth-agent before any data access
- Frontend integration must be validated with backend APIs
- Security reviews required for all authentication and authorization changes

### Environment Management
- Use environment variables for all configuration
- No hardcoded secrets or credentials
- Separate configurations for development, testing, and production
- All sensitive data must be stored securely and accessed via environment variables

## Governance

All development activities must comply with this constitution. Amendments require explicit documentation, approval, and migration planning. All pull requests and code reviews must verify constitution compliance. Complexity must be justified with clear reasoning and alternatives considered.

**Version**: 1.1.0 | **Ratified**: 2026-02-06 | **Last Amended**: 2026-02-06
