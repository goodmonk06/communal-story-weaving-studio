# Changelog

All notable changes to the Communal Story Weaving Studio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-01-XX - Phase 3: Domain Deepening & Extension Points

### Added
- **Domain Model Expansion**
  - `Community` entity for organization management
  - `Member` entity with profiles and preferences
  - `Tag` entity for categorization with usage tracking
  - `FragmentReaction` for engagement (LIKE, LOVE, INSIGHTFUL, INSPIRING)
  - `ProjectCollaborator` for multi-user collaboration
  - `Comment` entity with threaded replies support
  - `ActivityLog` for complete audit trails
  - `FragmentTag` join table for many-to-many relationships

- **Enhanced Existing Entities**
  - Fragment: status, visibility, metadata, edit/view counts, soft delete
  - Project: status, visibility, cost tracking, soft delete
  - WovenStoryVersion: generation cost tracking

- **Adapter System**
  - `INotificationAdapter` with Console and NoOp implementations
  - `IAIProviderAdapter` with OpenAI and Mock implementations
  - `IStorageAdapter` with Local and NoOp implementations
  - `IAnalyticsAdapter` with Console and NoOp implementations

- **Event System**
  - Domain event bus for loose coupling
  - Event types: fragment.created, project.woven, comment.created, etc.
  - Event handlers can be registered by plugins

- **Infrastructure**
  - Comprehensive test suite with Vitest
  - Test factories for all entities
  - Enhanced seed script with communities, members, tags, reactions, comments
  - Metrics collection system (counters, gauges, histograms)
  - Structured logging with Pino
  - Centralized error handling with typed errors

- **Documentation**
  - docs/PHASE3_OVERVIEW.md - Architecture and roadmap
  - docs/DOMAIN_MODEL.md - Complete entity documentation
  - docs/ARCHITECTURE.md - System architecture guide
  - CHANGELOG.md - This file

- **Development Experience**
  - Prettier configuration for code formatting
  - Additional npm scripts: typecheck, format, test coverage, docker management
  - Vitest configuration with coverage
  - Test setup with @testing-library

### Changed
- **Database Schema** (Breaking Changes)
  - RawStoryFragment now requires proper Member and Community foreign keys
  - StoryWeaveProject requires `createdBy` Member ID
  - Tags are now separate entities instead of JSON arrays
  - All string-based member/community IDs should be migrated to proper relationships

### Migration Guide from 0.1.0 to 0.3.0

If you have existing data from version 0.1.0:

1. **Create Communities**
   ```sql
   INSERT INTO "Community" (id, name, slug, description, "createdAt", "updatedAt")
   SELECT DISTINCT "communityId", "communityId", "communityId", '', NOW(), NOW()
   FROM "RawStoryFragment";
   ```

2. **Create Members**
   ```sql
   INSERT INTO "Member" (id, "communityId", username, "createdAt", "updatedAt")
   SELECT DISTINCT "memberId", "communityId", "memberId", NOW(), NOW()
   FROM "RawStoryFragment";
   ```

3. **Migrate Tags**
   - Extract unique tags from tagsJson
   - Create Tag entities
   - Create FragmentTag relationships

4. **Update Projects**
   - Add `createdBy` field (use first member of community)
   - Set default status and visibility

5. **Run New Migrations**
   ```bash
   npm run db:migrate
   ```

## [0.2.0] - 2025-01-XX - Phase 2: Production Infrastructure

### Added
- **Docker Support**
  - Dockerfile with multi-stage builds for Next.js app
  - Updated docker-compose.yml with app, postgres, and redis services
  - Standalone Next.js output for optimized containerization

- **Testing Infrastructure**
  - Vitest configuration with coverage support
  - Test setup with testing-library
  - Unit tests for errors, metrics, events, adapters
  - Test factories for generating test data

- **Logging System**
  - Pino structured logging
  - Log levels: debug, info, warn, error
  - Contextual logging support
  - Pretty printing in development

- **Error Handling**
  - Centralized error classes (AppError, NotFoundError, ValidationError, etc.)
  - Consistent error responses across API
  - Proper HTTP status codes
  - Error handler wrapper for API routes

- **Metrics System**
  - In-memory metrics collector
  - Counters, gauges, and histograms
  - Timing helpers for performance tracking
  - Metrics snapshot endpoint (future)

- **Code Quality**
  - Prettier configuration
  - Format and format:check scripts
  - TypeScript strict mode enabled
  - ESLint configuration

### Changed
- Updated package.json with new dependencies (pino, vitest, prettier, msw)
- Enhanced npm scripts for better DX
- Next.js config updated for standalone output

## [0.1.0] - 2025-01-XX - Initial Release

### Added
- **Core Features**
  - Story fragment collection and management
  - AI-powered story weaving using OpenAI GPT-4
  - Project-based narrative organization
  - Full traceability of woven stories to source fragments

- **Domain Model**
  - RawStoryFragment entity
  - StoryWeaveProject entity
  - StoryFragmentSelection join table with roles
  - WovenStoryVersion for generated narratives

- **API Endpoints**
  - Fragment CRUD operations
  - Project management
  - Fragment selection for projects
  - AI weaving endpoint

- **User Interface**
  - Next.js 14 with App Router
  - Fragment browsing and creation
  - Project management interface
  - Woven narrative viewing
  - Tailwind CSS styling

- **Infrastructure**
  - PostgreSQL database with Prisma ORM
  - Docker Compose for local development
  - Seed data with demo content
  - Basic validation with Zod

- **Documentation**
  - Comprehensive README
  - Setup instructions
  - Use cases and examples
  - API documentation

### Technical Stack
- Next.js 14
- React 18
- TypeScript 5
- Prisma 5
- PostgreSQL 16
- Tailwind CSS 3
- OpenAI API
- React Markdown

---

## Future Releases (Planned)

### [0.4.0] - Authentication & Authorization
- User authentication system
- JWT tokens
- Role-based access control
- Permission system
- OAuth integration
- Session management

### [0.5.0] - Real-time Features
- WebSocket support
- Live collaboration
- Presence awareness
- Real-time notifications
- Live editing indicators

### [0.6.0] - Advanced AI Features
- Custom weaving templates
- Style transfer
- Multi-language support
- Alternative AI providers (Anthropic, local models)
- AI response caching
- Batch processing

### [0.7.0] - Publishing & Distribution
- Export to multiple formats (PDF, DOCX, Markdown)
- Publishing workflows
- Content scheduling
- RSS feeds
- Email newsletters
- Integration with CMS platforms

### [1.0.0] - Production Ready
- Complete API documentation (OpenAPI/Swagger)
- Full test coverage
- Performance optimization
- Security hardening
- Production deployment guide
- Multi-tenancy support
- Enterprise features
