# Phase 3 Overview: Communal Story Weaving Studio

## Purpose Statement

The **Communal Story Weaving Studio** is a production-ready platform that enables communities to collect individual stories, experiences, and perspectives from members and uses AI to weave them into cohesive, compelling collective narratives. This system solves the challenge of transforming disparate personal accounts into unified stories while maintaining full traceability and attribution to honor each contributor's voice.

The platform serves as a critical building block in larger community ecosystems, providing narrative generation capabilities that can be integrated with other services for blogs, books, documentaries, organizational storytelling, and educational content creation.

## Current Features

### Implemented
- **Story Fragment Management**: CRUD operations for individual story contributions with markdown support, tagging, and member attribution
- **Weaving Projects**: Organize fragments into projects with roles (Core, Supporting, Quote)
- **AI Narrative Generation**: GPT-4 powered story weaving that creates cohesive narratives from selected fragments
- **Version History**: Track all generated narrative versions with full AI metadata
- **Traceability**: Complete mapping of woven stories back to source fragments
- **Rich UI**: Next.js frontend with fragment browsing, project management, and narrative viewing
- **API Layer**: RESTful API with Zod validation for all operations
- **Database**: PostgreSQL with Prisma ORM, comprehensive schema with relationships
- **Seed Data**: Demo fragments and pre-generated woven story for exploration
- **Docker Support**: Full containerization with Docker Compose
- **Logging Infrastructure**: Pino-based structured logging
- **Error Handling**: Centralized error handler with typed errors
- **Metrics**: In-memory metrics collection for monitoring

### Current Limitations
- No user authentication or authorization
- No member/community entity management (referenced by string IDs only)
- No commenting or collaboration features on fragments or projects
- No fragment versioning (edit history)
- No project collaboration (multiple editors)
- No notification system for project updates
- No export functionality for woven stories
- Limited analytics on fragment usage and story performance
- No caching layer for AI responses
- No rate limiting or abuse prevention
- No search/filter capabilities beyond basic queries
- No real-time collaboration features
- No mobile-optimized UI

## Phase 3 Plan

### 1. Domain Deepening (New Entities & Relationships)

#### Core Entity Additions
- **Member**: Proper user entity with profiles, preferences, bio, avatar
- **Community**: Community entity with settings, theme, description, member relationships
- **Tag**: Separate tag entity with usage counts and categorization
- **FragmentReaction**: Reactions (like, love, insightful) on fragments
- **ProjectCollaborator**: Multi-user collaboration on weaving projects
- **ActivityLog**: Audit trail for all major actions
- **Comment**: Threaded comments on fragments and projects

#### Enhanced Fields
- Add `status` enum to fragments (draft, published, archived)
- Add `visibility` to projects (private, community, public)
- Add `metadata` JSON fields for extensibility
- Add soft-delete timestamps
- Add `lastEditedAt` and `editCount` tracking
- Add `aiGenerationCost` tracking for budget management

### 2. Additional Vertical Slices

Beyond the existing fragment/project flows, implement:

**a) Community Management Flow**
- Create → View → Update community settings
- Invite members → Manage roles
- View community analytics

**b) Collaboration Flow**
- Add collaborators to projects
- Comment on fragments
- React to content
- Activity feed

**c) Advanced Search & Discovery**
- Full-text search across fragments
- Filter by tags, members, dates
- Browse popular/trending fragments
- Related fragment suggestions

### 3. Extension & Integration Points

#### Adapter Interfaces
- **INotificationAdapter**: Send notifications for comments, mentions, project updates
- **IStorageAdapter**: Abstract file storage for future media uploads
- **IAIProviderAdapter**: Support multiple AI providers (OpenAI, Anthropic, local models)
- **IAnalyticsAdapter**: Track events and usage patterns
- **ISearchAdapter**: Pluggable search backend (PostgreSQL full-text, Elasticsearch, etc.)

#### Event System
- Domain events for all major actions (FragmentCreated, StoryWoven, etc.)
- Event handlers can be registered by plugins
- Support for async processing (future queue integration)

#### Plugin Registry
- Simple plugin system for extending functionality
- Plugins can add custom fragment types, weaving strategies, export formats

### 4. Testing Strategy

#### Unit Tests
- Domain logic (weaving algorithms, validation rules)
- Utility functions (logger, metrics, error handling)
- Service layer methods

#### Integration Tests
- API endpoints with database
- Full vertical slices (create fragment → weave → view)
- AI integration (with mocked responses for CI)

#### Test Fixtures
- Factory functions for all entities
- Realistic test data sets
- Shared test utilities

### 5. Documentation Enhancements

- **Architecture Diagram**: Visual representation of system layers
- **Integration Recipes**: How to connect with auth service, notification hub, content management
- **API Documentation**: OpenAPI/Swagger spec
- **Domain Model Diagrams**: Entity relationships with cardinality
- **Extension Guide**: How to write plugins and adapters
- **Deployment Guide**: Production deployment checklist

### 6. Production Readiness

- Rate limiting middleware
- Request ID tracking across logs
- Health check endpoints
- Graceful shutdown handling
- Database connection pooling
- Redis caching for AI responses and frequent queries
- Background job processing setup (future)
- Security headers and CORS configuration
- Input sanitization for XSS prevention

## Next Milestones

1. **Phase 3 Completion**: Implement all items above (~2-3 weeks of focused development)
2. **Phase 4 - Authentication & Authorization**: Add proper user management, permissions, multi-tenancy
3. **Phase 5 - Advanced AI Features**: Custom weaving templates, style transfer, multi-language support
4. **Phase 6 - Real-time Collaboration**: WebSocket support, live editing, presence awareness
5. **Phase 7 - Publishing & Distribution**: Export to multiple formats, scheduling, content pipelines

## Integration Vision

This platform is designed to integrate seamlessly into a larger community ecosystem:

- **Auth Service**: Delegate authentication, receive user context
- **Notification Hub**: Send real-time notifications for mentions, comments, publications
- **Content Management**: Feed woven stories into blogs, newsletters, documentation systems
- **Analytics Platform**: Export usage metrics and content performance data
- **Media Service**: Upload images/videos referenced in fragments
- **Search Service**: Index fragments and stories for global community search

The architecture prioritizes loose coupling through adapters and events, making it straightforward to connect with other services without creating tight dependencies.
